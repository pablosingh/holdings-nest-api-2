# Spec — Creación de operaciones con auto-resolución

## Objetivo

Al crear una operación (`POST /operations`), el backend debe:

1. Auto-resolver la `cripto` a partir del `ticker`
2. Auto-resolver o crear el `holding` a partir del `ticker` + `user_id`
3. Validar reglas de negocio según sea compra o venta
4. Actualizar el holding automáticamente al crear la operación

---

## 1. DTO — `CreateOperationDto`

```typescript
// src/operations/dto/create-operation.dto.ts

export class CreateOperationDto {
  @IsString()
  @MinLength(1)
  ticker: string;

  @IsNumber()
  number: number;

  @IsNumber()
  price: number;

  @IsNumber()
  total: number;

  @IsBoolean()
  buy: boolean;

  @IsOptional()
  @IsString()
  exchange?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsNumber()
  user_id: number;   // ← nuevo: necesario para buscar/crear holding
}
```

**Eliminado:** `cripto_id`, `holding_id` — se resuelven automáticamente.

---

## 2. Lógica — `OperationsService.create()`

### 2.1 Resolver cripto

```typescript
const { rows: criptos } = await db.query('SELECT * FROM cripto WHERE ticker = $1', [tickerUpper]);
const cripto = criptos[0];

if (!cripto) {
  throw new NotFoundException(`Cripto ${tickerUpper} no encontrada`);
}
```

### 2.2 Resolver/crear holding

```typescript
const existingHolding = await db.query(
  'SELECT * FROM holding WHERE ticker = $1 AND user_id = $2',
  [tickerUpper, dto.user_id],
);

if (!dto.buy) {
  // --- VENTA ---
  if (!existingHolding) {
    throw new BadRequestException(`No hay holding para vender ${tickerUpper}`);
  }
  if (Number(existingHolding.amount) < dto.number) {
    throw new BadRequestException(
      `No tienes suficientes ${tickerUpper} para vender. ` +
      `Disponible: ${existingHolding.amount}, solicitado: ${dto.number}`,
    );
  }
  // Actualizar holding: restar amount
  const newAmount = Number(existingHolding.amount) - dto.number;
  if (newAmount === 0) {
    await db.query('DELETE FROM holding WHERE id = $1', [existingHolding.id]);
    holdingId = null; // operación sin holding
  } else {
    await db.query('UPDATE holding SET amount = $1 WHERE id = $2', [newAmount, existingHolding.id]);
    holdingId = existingHolding.id;
  }
} else {
  // --- COMPRA ---
  if (!existingHolding) {
    // No existe → crear holding
    const newHolding = await db.query(
      `INSERT INTO holding (ticker, amount, initial_price, initial_total, user_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [tickerUpper, dto.number, dto.price, dto.total, dto.user_id],
    );
    holdingId = newHolding.id;
  } else {
    // Existe → actualizar: amount +, initial_total +, recalcular precio promedio
    const oldAmount = Number(existingHolding.amount);
    const oldTotal = Number(existingHolding.initial_total);
    const newAmount = oldAmount + dto.number;
    const newTotal = oldTotal + dto.total;
    const newAvgPrice = newTotal / newAmount;

    await db.query(
      `UPDATE holding SET amount = $1, initial_total = $2, initial_price = $3 WHERE id = $4`,
      [newAmount, newTotal, newAvgPrice, existingHolding.id],
    );
    holdingId = existingHolding.id;
  }
}
```

### 2.3 Crear operación

```typescript
const result = await db.query(
  `INSERT INTO operation (ticker, number, price, total, buy, exchange, comment, cripto_id, holding_id)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
  [tickerUpper, dto.number, dto.price, dto.total, dto.buy,
   dto.exchange ?? null, dto.comment ?? null, cripto.id, holdingId],
);
```

---

## 3. Listar operaciones con filtro por ticker

### Controller

```typescript
@Get()
findAll(
  @Query('cripto_id') cripto_id?: string,
  @Query('holding_id') holding_id?: string,
  @Query('ticker') ticker?: string,      // ← nuevo
) {
  return this.operationsService.findAll(
    cripto_id ? +cripto_id : undefined,
    holding_id ? +holding_id : undefined,
    ticker,
  );
}
```

### Service

```typescript
async findAll(cripto_id?: number, holding_id?: number, ticker?: string) {
  let query = `SELECT o.*, c.ticker AS cripto_ticker
               FROM operation o
               JOIN cripto c ON c.id = o.cripto_id`;
  const conditions: string[] = [];
  const params: any[] = [];
  let idx = 1;

  if (cripto_id) { conditions.push(`o.cripto_id = $${idx++}`); params.push(cripto_id); }
  if (holding_id) { conditions.push(`o.holding_id = $${idx++}`); params.push(holding_id); }
  if (ticker) { conditions.push(`c.ticker = $${idx++}`); params.push(ticker.toUpperCase()); }

  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY o.date DESC';

  const { rows } = await this.db.query(query, params);
  return rows;
}
```

---

## 4. Diagrama de flujo

```
POST /operations { ticker, number, price, total, buy, user_id, ... }
  │
  ├─ 1. Buscar cripto por ticker
  │     ├─ Existe → tomar cripto.id
  │     └─ No existe → 404 Not Found
  │
  ├─ 2. ¿buy === true?
  │     │
  │     ├─ SÍ (COMPRA)
  │     │   ├─ Buscar holding por ticker + user_id
  │     │   ├─ ¿Existe?
  │     │   │   ├─ SÍ → UPDATE holding: amount += number, total += total, recalcular precio promedio
  │     │   │   └─ NO → INSERT holding con amount, initial_price, initial_total
  │     │   └─ holdingId = holding.id
  │     │
  │     └─ NO (VENTA)
  │         ├─ Buscar holding por ticker + user_id
  │         ├─ ¿Existe?
  │         │   ├─ NO → 400 Bad Request "No hay holding para vender"
  │         │   └─ SÍ → ¿amount >= number?
  │         │       ├─ SÍ → UPDATE holding: amount -= number (si 0 → DELETE holding)
  │         │       └─ NO → 400 Bad Request "No tienes suficientes"
  │         └─ holdingId = holding.id (o null si se eliminó)
  │
  └─ 3. INSERT operation con cripto_id y holding_id
```

---

## 5. Archivos a modificar

| Archivo | Cambio |
|---|---|
| `backend/src/operations/dto/create-operation.dto.ts` | Nuevo DTO: eliminar `cripto_id`, `holding_id`; agregar `user_id` |
| `backend/src/operations/operations.service.ts` | Lógica completa de resolución + validación + actualización holding |
| `backend/src/operations/operations.controller.ts` | Agregar `@Query('ticker')` al `findAll` |
| `backend/src/holdings/holdings.service.ts` | Opcional: exponer `findByTickerAndUser(ticker, userId)` |
| `backend/src/criptos/criptos.service.ts` | Opcional: exponer `findByTicker(ticker)` |

---

## 6. Casos borde

| Caso | Comportamiento |
|---|---|
| Vender sin holding existente | `400 Bad Request` |
| Vender más de lo que se tiene | `400 Bad Request` con detalle (disponible vs solicitado) |
| Vender dejando amount en 0 | Se elimina el holding (`DELETE`) |
| Comprar sin holding existente | Se crea holding automáticamente |
| Comprar con holding existente | Se actualiza amount, total, y precio promedio |
| Ticker en minúsculas | Se normaliza a `UPPER` siempre |
| Cripto no existe (ni para compra ni venta) | `404 Not Found` |
