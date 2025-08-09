import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Products API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
       Product: {
        type: "object",
        required: ["id", "name", "price", "category"],
        properties: {
          id: { type: "string", format: "uuid", readOnly: true },
          name: { type: "string" },
          price: { type: "number", minimum: 0 },
          category: { type: "string", enum: ["Apparel", "Electronics", "Home", "Books", "Other"] },
          description: { type: "string", nullable: true }
        }
      },
      NewProduct: {
        type: "object",
        required: ["name", "price", "category"],
        properties: {
          name: { type: "string" },
          price: { type: "number", minimum: 0 },
          category: { type: "string", enum: ["Apparel", "Electronics", "Home", "Books", "Other"] },
          description: { type: "string", nullable: true }
        }
      }
      }
    }
  },
  apis: ["./src/**/*.ts"], // scans JSDoc in your TS files
});
