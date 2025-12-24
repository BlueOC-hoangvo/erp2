import { z } from "zod";
import { zBigInt } from "../../common/zod";

export const onhandQueryDto = z.object({
  warehouseId: zBigInt.optional(),
  locationId: zBigInt.optional(),

  itemId: zBigInt.optional(),
  productVariantId: zBigInt.optional(),

  itemType: z.enum(["FABRIC", "ACCESSORY", "PACKING", "OTHER"]).optional(),
  q: z.string().trim().optional(),

  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
}).refine(v => !(v.itemId && v.productVariantId), {
  message: "Provide either itemId or productVariantId, not both",
});

export const ledgerQueryDto = z.object({
  warehouseId: zBigInt.optional(),
  locationId: zBigInt.optional(),
  itemId: zBigInt.optional(),
  productVariantId: zBigInt.optional(),

  moveType: z.enum(["RECEIPT", "ISSUE", "OUT", "ADJUST", "TRANSFER"]).optional(),

  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),

  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
}).refine(v => !(v.itemId && v.productVariantId), {
  message: "Provide either itemId or productVariantId, not both",
});