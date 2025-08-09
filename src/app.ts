import express from "express";
import { errorHandler } from "./middleware/error";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { productsRouter } from "./routes/product";
import "./db";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/openapi.json", (_req, res) => res.json(swaggerSpec));

  app.use("/products", productsRouter);
  app.get("/", (_req, res) => {
    res.json({ ok: true, msg: "please check http://localhost:3000/docs for docs" });
  });

  app.use(errorHandler);

  return app;
}

export const app = createApp();
