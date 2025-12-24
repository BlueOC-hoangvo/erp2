import { z } from "zod";
import { zBigInt } from "../../common/zod";

const zDecStr = z.coerce.string().refine((s) => s.trim() !== "", "Required");

export const generateMaterialsQueryDto = z.object({
    mode: z.enum(["replace", "merge"]).optional(), // default replace
  });
export const moBreakdownDto = z.object({
  productVariantId: zBigInt,
  qtyPlan: zDecStr,
  qtyDone: zDecStr.optional(),
});

export const moMaterialReqDto = z.object({
  itemId: zBigInt,
  uom: z.string().trim().min(1).max(20).default("pcs"),
  qtyRequired: zDecStr,
  qtyIssued: zDecStr.optional(),
  wastagePercent: zDecStr.optional(),
});

export const moCreateDto = z.object({
  moNo: z.string().trim().min(1).max(50),
  salesOrderItemId: zBigInt.optional(),
  productStyleId: zBigInt,
  qtyPlan: zDecStr,
  startDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  status: z.enum(["DRAFT", "RELEASED", "RUNNING", "DONE", "CANCELLED"]).optional(),
  note: z.string().optional(),
  breakdowns: z.array(moBreakdownDto).optional(),
  materialRequirements: z.array(moMaterialReqDto).optional(),
});

export const moUpdateDto = moCreateDto
  .omit({ moNo: true, productStyleId: true, qtyPlan: true })
  .partial()
  .extend({
    productStyleId: zBigInt.optional(),
    qtyPlan: zDecStr.optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "At least one field is required" });

export const moQueryDto = z.object({
  q: z.string().trim().optional(),
  status: z.enum(["DRAFT", "RELEASED", "RUNNING", "DONE", "CANCELLED"]).optional(),
  productStyleId: zBigInt.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),
});

export const zIdParam = z.object({ id: zBigInt });
