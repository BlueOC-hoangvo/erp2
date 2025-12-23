import { z } from "zod";

export const CreateProductSchema = z.object({
  sku: z.string().min(1, "SKU không được để trống"),
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  unit: z.string().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  length: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  standardCost: z.number().positive().optional(),
  salePrice: z.number().positive().optional(),
  safetyStock: z.number().int().nonnegative().optional(),
  status: z.string().default("active"),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ProductQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  q: z.string().optional(),
  status: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductQuery = z.infer<typeof ProductQuerySchema>;
