import { z } from "zod";

export const ProductCategory = z.enum(["Apparel", "Electronics", "Home", "Books", "Other"]);

export const Product = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  category: ProductCategory,
  description: z.string().optional(),
});

export type Product = z.infer<typeof Product>;

export const NewProduct = Product.omit({ id: true });
export type NewProduct = z.infer<typeof NewProduct>;
