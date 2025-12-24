import { z } from "zod";
import { zBigInt } from "../../common/zod";

export const productStyleCreateDto = z.object({
  code: z.string().trim().min(1).max(50).optional(),
  name: z.string().trim().min(1).max(200),
  note: z.string().trim().max(255).optional(),
  isActive: z.coerce.boolean().optional(),
});

export const productStyleUpdateDto = productStyleCreateDto.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "At least one field is required" }
);

export const productStyleQueryDto = z.object({
  q: z.string().trim().optional(),
  isActive: z.coerce.boolean().optional(),

  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),

  sortBy: z.enum(["createdAt", "updatedAt", "name"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const zIdParam = z.object({ id: zBigInt });
