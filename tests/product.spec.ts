import request from "supertest";
import { app } from "../src/app";

describe("Products API", () => {
  it("GET /products returns a list", async () => {
    const res = await request(app).get("/products").expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GET /products?category=Apparel filters by category", async () => {
    const res = await request(app).get("/products").query({ category: "Apparel" }).expect(200);
    expect(res.body.every((p: any) => p.category === "Apparel")).toBe(true);
  });

  it("GET /products?category=Bad should 400", async () => {
    await request(app).get("/products").query({ category: "Bad" }).expect(400);
  });

  it("GET /products/:id returns a single product or 404", async () => {
    const list = await request(app).get("/products").expect(200);
    const id = list.body[0].id;
    const ok = await request(app).get(`/products/${id}`).expect(200);
    expect(ok.body.id).toBe(id);

    await request(app).get("/products/00000000-0000-0000-0000-000000000000").expect(404);
  });

  it("POST /products validates and creates", async () => {
    const payload = { name: "Mug", price: 12.5, category: "Home", description: "Ceramic" };
    const res = await request(app).post("/products").send(payload).expect(201);
    expect(res.body.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(res.body.name).toBe("Mug");
  });

  it("POST /products rejects invalid payload", async () => {
    await request(app)
      .post("/products")
      .send({ name: "", price: -10, category: "Nope" })
      .expect(400);
  });
});
