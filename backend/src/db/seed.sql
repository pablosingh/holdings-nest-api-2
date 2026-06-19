CREATE TABLE IF NOT EXISTS "user" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS cripto (
  id SERIAL PRIMARY KEY,
  ticker VARCHAR(10) UNIQUE NOT NULL,
  price DECIMAL(18,8) NOT NULL DEFAULT 0,
  updated_price TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS holding (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP DEFAULT NOW(),
  ticker VARCHAR(10) NOT NULL,
  amount DECIMAL(18,8) NOT NULL DEFAULT 0,
  initial_price DECIMAL(18,8) NOT NULL DEFAULT 0,
  initial_total DECIMAL(18,8) NOT NULL DEFAULT 0,
  user_id INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS operation (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP DEFAULT NOW(),
  ticker VARCHAR(10) NOT NULL,
  number DECIMAL(18,8) NOT NULL,
  price DECIMAL(18,8) NOT NULL,
  total DECIMAL(18,8) NOT NULL,
  buy BOOLEAN NOT NULL DEFAULT TRUE,
  exchange VARCHAR(50),
  comment TEXT,
  cripto_id INTEGER NOT NULL REFERENCES cripto(id),
  holding_id INTEGER REFERENCES holding(id)
);

INSERT INTO "user" (name, email, password) VALUES
  ('Admin', 'admin@holdings.com', 'admin123'),
  ('Pablo', 'pablo@holdings.com', 'pablo123')
ON CONFLICT (email) DO NOTHING;

INSERT INTO cripto (ticker, price) VALUES
  ('BTC', 67500.00),
  ('ETH', 3450.00),
  ('SOL', 145.00),
  ('ADA', 0.45)
ON CONFLICT (ticker) DO NOTHING;
