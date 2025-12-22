import { z } from "zod";
import { zBigInt } from "../../common/zod";

export const ChangeStatusDTO = z.object({
  entityType: z.string().min(2).max(50),
  entityId: zBigInt,
  toStatus: z.string().min(1).max(50),
  note: z.string().max(255).optional(),
});

export const StatusHistoryQueryDTO = z.object({
  entityType: z.string().min(2).max(50),
  entityId: zBigInt,
});
