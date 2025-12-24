import { z } from "zod";
import { zBigInt } from "../../common/zod";

const zDecStr = z.coerce.string().refine((s) => s.trim() !== "", "Required");

export const bomLineInputDto = z.object({
  itemId: zBigInt,
  uom: z.string().trim().min(1).max(20).default("pcs"),
  qtyPerUnit: zDecStr, // Decimal string
  wastagePercent: zDecStr.optional(), // Decimal string
});

export const bomCreateDto = z.object({
  code: z.string().trim().min(1).max(50).optional(),
  productStyleId: zBigInt,
  name: z.string().trim().max(200).optional(),
  isActive: z.coerce.boolean().optional(),
  lines: z.array(bomLineInputDto).min(1).optional(), // cho phép tạo bom không có lines
});

export const bomUpdateDto = z
  .object({
    code: z.string().trim().min(1).max(50).optional(),
    productStyleId: zBigInt.optional(),
    name: z.string().trim().max(200).optional(),
    isActive: z.coerce.boolean().optional(),
    // nếu gửi lines => replace
    lines: z.array(bomLineInputDto).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "At least one field is required" });

export const bomQueryDto = z.object({
  q: z.string().trim().optional(),
  productStyleId: zBigInt.optional(),
  isActive: z.coerce.boolean().optional(),

  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),
});

export const zIdParam = z.object({ id: zBigInt });
