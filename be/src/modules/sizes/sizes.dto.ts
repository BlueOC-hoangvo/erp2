import { z } from "zod";
import { zBigInt } from "../../common/zod";

export const sizeCreateDto = z.object({
  code: z.string().trim().min(1).max(30),
  name: z.string().trim().max(80).optional(),
  isActive: z.coerce.boolean().optional(),
});

export const sizeUpdateDto = z.object({
  name: z.string().trim().max(80).optional(),
  isActive: z.coerce.boolean().optional(),
}).refine((v) => Object.keys(v).length > 0, { message: "At least one field is required" });

export const sizeQueryDto = z.object({
  q: z.string().trim().optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
  sortBy: z.enum(["createdAt", "updatedAt", "code"]).default("code"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const zIdParam = z.object({ id: zBigInt });
