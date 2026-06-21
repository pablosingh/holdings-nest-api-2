import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { buildUpdate } from '../db/build-update';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';

@Injectable()
export class OperationsService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateOperationDto) {
    const ticker = dto.ticker.toUpperCase();

    // 1. Resolve cripto
    const { rows: criptos } = await this.db.query(
      'SELECT * FROM cripto WHERE ticker = $1', [ticker],
    );
    const cripto = criptos[0];
    if (!cripto) {
      throw new NotFoundException(`Cripto ${ticker} no encontrada`);
    }

    // 2. Find existing holding for this ticker + user
    const { rows: holdings } = await this.db.query(
      'SELECT * FROM holding WHERE ticker = $1 AND user_id = $2',
      [ticker, dto.user_id],
    );
    const existingHolding = holdings[0];

    let holdingId: number | null = null;

    if (!dto.buy) {
      // --- SELL ---
      if (!existingHolding) {
        throw new BadRequestException(`No hay holding para vender ${ticker}`);
      }
      if (Number(existingHolding.amount) < dto.number) {
        throw new BadRequestException(
          `No tienes suficientes ${ticker} para vender. ` +
          `Disponible: ${existingHolding.amount}, solicitado: ${dto.number}`,
        );
      }
      const newAmount = Number(existingHolding.amount) - dto.number;
      if (newAmount === 0) {
        await this.db.query('DELETE FROM holding WHERE id = $1', [existingHolding.id]);
      } else {
        await this.db.query('UPDATE holding SET amount = $1 WHERE id = $2', [newAmount, existingHolding.id]);
        holdingId = existingHolding.id;
      }
    } else {
      // --- BUY ---
      if (!existingHolding) {
        const { rows } = await this.db.query(
          `INSERT INTO holding (ticker, amount, initial_price, initial_total, user_id)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [ticker, dto.number, dto.price, dto.total, dto.user_id],
        );
        holdingId = rows[0].id;
      } else {
        const oldAmount = Number(existingHolding.amount);
        const oldTotal = Number(existingHolding.initial_total);
        const newAmount = oldAmount + dto.number;
        const newTotal = oldTotal + dto.total;
        const newAvgPrice = newTotal / newAmount;

        await this.db.query(
          `UPDATE holding SET amount = $1, initial_total = $2, initial_price = $3 WHERE id = $4`,
          [newAmount, newTotal, newAvgPrice, existingHolding.id],
        );
        holdingId = existingHolding.id;
      }
    }

    // 3. Create operation
    const { rows } = await this.db.query(
      `INSERT INTO operation (ticker, number, price, total, buy, exchange, comment, cripto_id, holding_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [ticker, dto.number, dto.price, dto.total, dto.buy,
       dto.exchange ?? null, dto.comment ?? null, cripto.id, holdingId],
    );
    return rows[0];
  }

  async findAll(cripto_id?: number, holding_id?: number, ticker?: string) {
    let query = `SELECT o.*, c.ticker AS cripto_ticker FROM operation o JOIN cripto c ON c.id = o.cripto_id`;
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

  async findOne(id: number) {
    const { rows } = await this.db.query(
      `SELECT o.*, c.ticker AS cripto_ticker FROM operation o JOIN cripto c ON c.id = o.cripto_id WHERE o.id = $1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException(`Operation #${id} not found`);
    return rows[0];
  }

  async update(id: number, dto: UpdateOperationDto) {
    await this.findOne(id);
    const q = buildUpdate('operation', id, {
      ...dto,
      ticker: dto.ticker?.toUpperCase(),
    }, { number: '"number"' });
    if (!q) return this.findOne(id);
    const { rows } = await this.db.query(q.text, q.values);
    return rows[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query('DELETE FROM operation WHERE id = $1', [id]);
    return { deleted: true };
  }
}
