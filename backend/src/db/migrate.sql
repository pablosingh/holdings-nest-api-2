-- Paso 1: Actualizar usuario Pablo con datos del backup
UPDATE "user"
SET email = 'pablo.rm.singh@gmail.com',
    name = 'Pablo Roberto Singh'
WHERE id = 2;

-- Paso 2: Insertar criptos del backup que no existen
INSERT INTO cripto (ticker, price, updated_price)
SELECT cripto, price, "updatePrice"
FROM "Criptos" old
WHERE NOT EXISTS (
  SELECT 1 FROM cripto n WHERE n.ticker = old.cripto
);

-- Paso 3: Insertar holdings preservando IDs originales
INSERT INTO holding (id, date, ticker, amount, initial_price, initial_total, user_id)
SELECT id, date, ticker, amount, "initialPrice", "initialTotal", 2
FROM "Holdings";

SELECT setval('holding_id_seq', (SELECT MAX(id) FROM holding));

-- Paso 4: Insertar operations preservando IDs y resolviendo cripto_id
INSERT INTO operation (id, date, ticker, number, price, total, buy, exchange, comment, cripto_id, holding_id)
SELECT o.id, o.date, o.ticker, o.number, o.price, o.total, o.buy, o.exchange, o.comment,
       c.id AS cripto_id,
       o."HoldingId" AS holding_id
FROM "Operations" o
JOIN cripto c ON c.ticker = o.ticker;

SELECT setval('operation_id_seq', (SELECT MAX(id) FROM operation));

-- Paso 5: Limpiar tablas viejas
DROP TABLE "Tasks" CASCADE;
DROP TABLE "Operations" CASCADE;
DROP TABLE "Holdings" CASCADE;
DROP TABLE "Criptos" CASCADE;
DROP TABLE "Users" CASCADE;
