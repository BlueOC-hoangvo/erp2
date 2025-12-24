import { z } from "zod";
import { zBigInt } from "../../common/zod";

export const AuditQueryDTO = z.object({
  page: z
    .preprocess(
      (v) => (v === undefined ? 1 : Number(v)),
      z.number().int().min(1)
    )
    .optional(),
  limit: z
    .preprocess(
      (v) => (v === undefined ? 20 : Number(v)),
      z.number().int().min(1).max(100)
    )
    .optional(),
  entityType: z.string().optional(),
  entityId: zBigInt.optional(),
  action: z.string().optional(),
});
