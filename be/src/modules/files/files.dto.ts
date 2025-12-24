import { z } from "zod";
import { zBigInt } from "../../common/zod";

export const AttachFileDTO = z.object({
  entityType: z.string().min(2).max(50),
  entityId: zBigInt,
  fileId: zBigInt,
  tag: z.string().max(50).optional(),
});

export const EntityFilesQueryDTO = z.object({
  entityType: z.string().min(2).max(50),
  entityId: zBigInt,
});
