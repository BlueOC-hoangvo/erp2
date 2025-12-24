import { z } from "zod";
import { zBigInt } from "../../common/zod";

export const productVariantCreateDto = z.object({
  sku: z.string().trim().min(1).max(60).optional(),
  productStyleId: zBigInt,
  sizeId: zBigInt,
  colorId: zBigInt,
  isActive: z.coerce.boolean().optional(),
});

export const productVariantUpdateDto = z.object({
  sku: z.string().trim().min(1).max(60).optional(),
  sizeId: zBigInt.optional(),
  colorId: zBigInt.optional(),
  isActive: z.coerce.boolean().optional(),
}).refine((v) => Object.keys(v).length > 0, { message: "At least one field is required" });

export const productVariantQueryDto = z.object({
  productStyleId: zBigInt.optional(),
  sizeId: zBigInt.optional(),
  colorId: zBigInt.optional(),
  isActive: z.coerce.boolean().optional(),

  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),

  sortBy: z.enum(["createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const zIdParam = z.object({ id: zBigInt });
