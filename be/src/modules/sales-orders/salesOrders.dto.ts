import { z } from "zod";
import { zBigInt } from "../../common/zod";

const zDecStr = z.coerce.string().refine((s) => s.trim() !== "", "Required"); // accept number -> string

export const soBreakdownDto = z.object({
  productVariantId: zBigInt,
  qty: zDecStr, // decimal string
});

export const soItemDto = z.object({
  lineNo: z.coerce.number().int().min(1),
  productStyleId: zBigInt,
  itemName: z.string().trim().min(1).max(200),
  uom: z.string().trim().min(1).max(20).default("pcs"),
  qtyTotal: zDecStr,
  unitPrice: zDecStr,
  note: z.string().optional(),
  breakdowns: z.array(soBreakdownDto).optional(),
});

export const soCreateDto = z.object({
  orderNo: z.string().trim().min(1).max(50),
  customerId: zBigInt,
  orderDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  status: z.enum(["DRAFT", "CONFIRMED", "IN_PRODUCTION", "DONE", "CANCELLED"]).optional(),
  note: z.string().optional(),
  isInternal: z.coerce.boolean().optional(),
  items: z.array(soItemDto).min(1),
});

export const soUpdateDto = soCreateDto
  .omit({ orderNo: true, customerId: true, items: true })
  .partial()
  .extend({
    customerId: zBigInt.optional(),
    items: z.array(soItemDto).optional(), // nếu gửi thì replace toàn bộ items+breakdowns
  })
  .refine((v) => Object.keys(v).length > 0, { message: "At least one field is required" });

export const soQueryDto = z.object({
  q: z.string().trim().optional(),
  customerId: zBigInt.optional(),
  status: z.enum(["DRAFT", "CONFIRMED", "IN_PRODUCTION", "DONE", "CANCELLED"]).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),

  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),
  sortBy: z.enum(["orderDate", "createdAt", "updatedAt"]).default("orderDate"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const zIdParam = z.object({ id: zBigInt });
