import { z } from "zod";
import { zBigInt } from "../../common/zod";

const zDecStr = z.coerce.string().refine((s) => s.trim() !== "", "Required");

export const poLineDto = z.object({
  lineNo: z.coerce.number().int().min(1),
  itemId: zBigInt,
  uom: z.string().trim().min(1).max(20).default("pcs"),
  qty: zDecStr,
  unitPrice: zDecStr,
});

export const poCreateDto = z.object({
  poNo: z.string().trim().min(1).max(50),
  supplierId: zBigInt,
  orderDate: z.coerce.date().optional(),
  status: z.enum(["DRAFT", "CONFIRMED", "RECEIVING", "RECEIVED", "CANCELLED"]).optional(),
  note: z.string().optional(),
  lines: z.array(poLineDto).min(1),
});

export const poUpdateDto = poCreateDto
  .omit({ poNo: true, supplierId: true, lines: true })
  .partial()
  .extend({
    supplierId: zBigInt.optional(),
    lines: z.array(poLineDto).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "At least one field is required" });

export const poQueryDto = z.object({
  q: z.string().trim().optional(),
  supplierId: zBigInt.optional(),
  status: z.enum(["DRAFT", "CONFIRMED", "RECEIVING", "RECEIVED", "CANCELLED"]).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),
});

export const zIdParam = z.object({ id: zBigInt });
