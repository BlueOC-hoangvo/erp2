import { z } from "zod";
import { zBigInt } from "../../common/zod";

export const locationCreateDto = z.object({
  warehouseId: zBigInt,
  code: z.string().trim().min(1).max(50),
  name: z.string().trim().min(1).max(150),
  parentId: zBigInt.optional(),
});

export const locationQueryDto = z.object({
  warehouseId: zBigInt,
  parentId: zBigInt.optional(),
});

export const zIdParam = z.object({
  id: zBigInt,
});
