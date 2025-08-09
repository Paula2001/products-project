import Database from "better-sqlite3";
import { randomUUID } from "crypto";

const DB_PATH = process.env.DB_PATH || "./data.sqlite"; // use ":memory:" in tests
export const db = new Database(DB_PATH);

// --- migrate ---
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL CHECK (price >= 0),
    category TEXT NOT NULL CHECK (category IN ('Apparel','Electronics','Home','Books','Other')),
    description TEXT
  );
`);

// --- seed if empty ---
const count = db.prepare(`SELECT COUNT(*) as c FROM products`).get() as { c: number };
if (count.c === 0) {
  const insert = db.prepare(`
    INSERT INTO products (id, name, price, category, description)
    VALUES (@id, @name, @price, @category, @description)
  `);
  const seed = db.transaction(() => {
    insert.run({ id: randomUUID(), name: "T-Shirt", price: 19.99, category: "Apparel", description: "Cotton tee" });
    insert.run({ id: randomUUID(), name: "Jeans", price: 59.0, category: "Apparel", description: null });
    insert.run({ id: randomUUID(), name: "Headphones", price: 129.99, category: "Electronics", description: "Noise cancelling" });
  });
  seed();
}
