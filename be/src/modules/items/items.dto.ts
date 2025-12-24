import { z } from "zod";
import { zBigInt } from "../../common/zod";

export const itemCreateDto = z.object({
  sku: z.string().trim().min(1).max(60).optional(),
  name: z.string().trim().min(1).max(200),
  itemType: z.enum(["FABRIC", "ACCESSORY", "PACKING", "OTHER"]),
  baseUom: z.string().trim().min(1).max(20).default("pcs"),
  isActive: z.coerce.boolean().optional(),
  note: z.string().optional(),
});

export const itemUpdateDto = itemCreateDto.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "At least one field is required" }
);

export const itemQueryDto = z.object({
  q: z.string().trim().optional(),
  itemType: z.enum(["FABRIC", "ACCESSORY", "PACKING", "OTHER"]).optional(),
  isActive: z.coerce.boolean().optional(),

  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),

  sortBy: z.enum(["createdAt", "updatedAt", "name"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const zIdParam = z.object({ id: zBigInt });
