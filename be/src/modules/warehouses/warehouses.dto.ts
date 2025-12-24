import { z } from "zod";
import { zBigInt } from "../../common/zod";

export const warehouseCreateDto = z.object({
  code: z.string().trim().min(1).max(30),
  name: z.string().trim().min(1).max(150),
  note: z.string().trim().max(255).optional(),
});

export const warehouseUpdateDto = warehouseCreateDto.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "At least one field is required" }
);

export const warehouseQueryDto = z.object({
  q: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),
});

export const zIdParam = z.object({ id: zBigInt });
