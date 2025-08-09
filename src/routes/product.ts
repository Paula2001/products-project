import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import { Product, NewProduct, ProductCategory } from "../types/product";
import { validate } from "../middleware/validate";
import { db } from "../db";

export const productsRouter = Router();

const selectAll = db.prepare<Product>(`SELECT id, name, price, category, description FROM products`);
const selectByCategory = db.prepare<Product>(`
  SELECT id, name, price, category, description FROM products WHERE category = ?
`);
const selectById = db.prepare<Product>(`
  SELECT id, name, price, category, description FROM products WHERE id = ?
`);
const insert = db.prepare(`
  INSERT INTO products (id, name, price, category, description)
  VALUES (?, ?, ?, ?, ?)
`);

/**
 * @openapi
 * /products:
 *   get:
 *     summary: List products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Apparel, Electronics, Home, Books, Other]
 *     responses:
 *       200:
 *         description: Array of products
 */
productsRouter.get("/", (req: Request, res: Response) => {
  const { category } = req.query;
  if (typeof category === "string") {
    const parsed = ProductCategory.safeParse(category);
    if (!parsed.success) return res.status(400).json({ error: "Invalid category" });
    return res.json(selectByCategory.all(parsed.data));
  }
  res.json(selectAll.all());
});

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 */
productsRouter.get("/:id", (req: Request, res: Response) => {
  const row = selectById.get(req.params.id) as Product | undefined;
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create a product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProduct'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 */

productsRouter.post("/", validate(NewProduct), (req: Request, res: Response) => {
  const data = (req as any).validated as NewProduct;
  const id = randomUUID();
  insert.run(id, data.name, data.price, data.category, data.description ?? null);
  const created = selectById.get(id) as Product;
  res.status(201).json(created);
});
