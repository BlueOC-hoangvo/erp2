import { z } from "zod";
import { zBigInt } from "../../common/zod";

export const supplierCreateDto = z.object({
  code: z.string().trim().min(1).max(50).optional(),
  name: z.string().trim().min(1).max(200),
  taxCode: z.string().trim().min(1).max(50).optional(),
  phone: z.string().trim().min(1).max(30).optional(),
  email: z.string().trim().email().max(150).optional(),
  address: z.string().trim().min(1).max(255).optional(),
  note: z.string().optional(),
});

export const supplierUpdateDto = supplierCreateDto.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "At least one field is required" }
);

export const supplierQueryDto = z.object({
  q: z.string().trim().optional(),
  name: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().optional(),
  taxCode: z.string().trim().optional(),

  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),

  sortBy: z.enum(["createdAt", "updatedAt", "name"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const zIdParam = z.object({ id: zBigInt });
