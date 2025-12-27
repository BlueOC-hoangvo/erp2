import { z } from "zod";
import { zBigInt } from "../../common/zod";

const zDecStr = z.coerce.string().refine((s) => s.trim() !== "", "Required");

// Enhanced BOM Line Input với new fields
export const bomLineInputDto = z.object({
  itemId: zBigInt,
  uom: z.string().trim().min(1).max(20).default("pcs"),
  qtyPerUnit: zDecStr, // Decimal string
  wastagePercent: zDecStr.optional(), // Decimal string
  note: z.string().trim().max(500).optional(),
  isOptional: z.coerce.boolean().optional(),
  leadTimeDays: z.coerce.number().int().min(0).optional(),
  subBomId: zBigInt.optional(),
  parentLineId: zBigInt.optional(),
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

// Enhanced BOM DTOs for new features
export const bomExplosionQueryDto = z.object({
  quantity: z.coerce.number().positive().default(1),
  bomVersionId: zBigInt.optional(),
});

export const bomCostQueryDto = z.object({
  quantity: z.coerce.number().positive().default(1),
  bomVersionId: zBigInt.optional(),
});

export const bomLeadTimeQueryDto = z.object({
  bomVersionId: zBigInt.optional(),
});

export const bomVersionCreateDto = z.object({
  versionNo: z.string().trim().min(1).max(20),
  description: z.string().trim().max(500).optional(),
  effectiveFrom: z.string().datetime().optional(),
  parentVersionId: zBigInt.optional(),
  createdById: zBigInt,
});

export const submitApprovalDto = z.object({
  approvers: z.array(z.coerce.bigint()).min(1),
});

export const approveRejectDto = z.object({
  comments: z.string().trim().max(1000).optional(),
});

export const bomTemplateCreateDto = z.object({
  name: z.string().trim().min(1).max(200),
  code: z.string().trim().min(1).max(50).optional(),
  description: z.string().trim().max(1000).optional(),
  category: z.string().trim().max(100).optional(),
  templateData: z.object({
    lines: z.array(bomLineInputDto).min(1),
  }),
});

export const bomFromTemplateDto = z.object({
  code: z.string().trim().min(1).max(50),
  productStyleId: zBigInt,
  name: z.string().trim().max(200),
  isActive: z.coerce.boolean().optional(),
});

export const compareVersionsDto = z.object({
  versionId1: zBigInt,
  versionId2: zBigInt,
});

// Fix: Create a simplified DTO without conflicting validation
export const bomTemplateQueryDto = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),
});

// Alternative: Create a template-specific params DTO if needed
export const bomTemplateIdParam = z.object({ 
  templateId: zBigInt 
});
