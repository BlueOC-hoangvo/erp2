import { z } from "zod";
import { zBigInt } from "../../common/zod";

export const stockMoveLineDto = z.object({
  itemId: zBigInt.optional(),
  productVariantId: zBigInt.optional(),
  uom: z.string().default("pcs"),
  qty: z.coerce.number().positive(),
  fromLocationId: zBigInt.optional(),
  toLocationId: zBigInt.optional(),
  note: z.string().optional(),
}).refine(v => !!v.itemId !== !!v.productVariantId, {
  message: "Either itemId or productVariantId must be provided",
});

export const stockMoveCreateDto = z.object({
  moveNo: z.string().trim().min(1),
  moveType: z.enum(["RECEIPT", "ISSUE", "OUT", "ADJUST", "TRANSFER"]),
  warehouseId: zBigInt,
  note: z.string().optional(),
  lines: z.array(stockMoveLineDto).min(1),
});
export const stockMoveQueryDto = z.object({
  warehouseId: zBigInt.optional(),
  moveType: z.enum(["RECEIPT", "ISSUE", "OUT", "ADJUST", "TRANSFER"]).optional(),
  status: z.enum(["DRAFT", "POSTED", "CANCELLED"]).optional(),

  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),

  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),
});

export const zIdParam = z.object({
  id: zBigInt,
});
