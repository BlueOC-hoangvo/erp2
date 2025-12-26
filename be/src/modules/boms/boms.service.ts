import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import { Prisma } from "@prisma/client";

const mapId = (x: any) => ({ ...x, id: x.id.toString() });

export class BomsService {
  static async list(q: any) {
    const where: Prisma.BomWhereInput = {};
    const AND: Prisma.BomWhereInput[] = [];

    if (q.q) AND.push({ OR: [{ code: { contains: q.q } }, { name: { contains: q.q } }] });
    if (q.productStyleId) AND.push({ productStyleId: q.productStyleId });
    if (q.isActive !== undefined) AND.push({ isActive: q.isActive });

    if (AND.length) where.AND = AND;

    const [total, rows] = await prisma.$transaction([
      prisma.bom.count({ where }),
      prisma.bom.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        include: { productStyle: true },
      }),
    ]);

    return {
      page: q.page,
      pageSize: q.pageSize,
      total,
      items: rows.map((b) => ({
        ...b,
        id: b.id.toString(),
        productStyleId: b.productStyleId.toString(),
        productStyle: mapId(b.productStyle),
      })),
    };
  }

  static async get(id: bigint) {
    const bom = await prisma.bom.findUnique({
      where: { id },
      include: {
        productStyle: true,
        lines: { include: { item: true }, orderBy: { id: "asc" } },
      },
    });
    if (!bom) throw E.notFound("BOM not found");

    return {
      ...bom,
      id: bom.id.toString(),
      productStyleId: bom.productStyleId.toString(),
      productStyle: mapId(bom.productStyle),
      lines: bom.lines.map((l) => ({
        ...l,
        id: l.id.toString(),
        bomId: l.bomId.toString(),
        itemId: l.itemId.toString(),
        item: mapId(l.item),
      })),
    };
  }

  static async create(data: any) {
    return prisma.$transaction(async (tx) => {
      const bom = await tx.bom.create({
        data: {
          ...(data.code !== undefined ? { code: data.code } : {}),
          productStyleId: BigInt(data.productStyleId),
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
          ...(data.lines !== undefined
            ? {
                lines: {
                  create: data.lines.map((l: any) => ({
                    itemId: BigInt(l.itemId),
                    uom: l.uom ?? "pcs",
                    qtyPerUnit: new Prisma.Decimal(l.qtyPerUnit),
                    wastagePercent: new Prisma.Decimal(l.wastagePercent ?? 0),
                    note: l.note ?? null,
                    isOptional: l.isOptional ?? false,
                    leadTimeDays: l.leadTimeDays ?? 0,
                  })),
                },
              }
            : {}),
        },
      });

      return { id: bom.id.toString() };
    });
  }

  static async update(id: bigint, data: any) {
    await this.get(id);

    return prisma.$transaction(async (tx) => {
      await tx.bom.update({
        where: { id },
        data: {
          ...(data.code !== undefined ? { code: data.code } : {}),
          ...(data.productStyleId !== undefined ? { productStyleId: BigInt(data.productStyleId) } : {}),
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        },
      });

      // ✅ replace lines nếu được gửi (kể cả [])
      if (data.lines !== undefined) {
        await tx.bomLine.deleteMany({ where: { bomId: id } });

        if (data.lines.length) {
          await tx.bomLine.createMany({
            data: data.lines.map((l: any) => ({
              bomId: id,
              itemId: BigInt(l.itemId),
              uom: l.uom ?? "pcs",
              qtyPerUnit: new Prisma.Decimal(l.qtyPerUnit),
              wastagePercent: new Prisma.Decimal(l.wastagePercent ?? 0),
              note: l.note ?? null,
              isOptional: l.isOptional ?? false,
              leadTimeDays: l.leadTimeDays ?? 0,
            })),
          });
        }
      }

      return { ok: true };
    });
  }

  static async remove(id: bigint) {
    await this.get(id);
    await prisma.bom.delete({ where: { id } });
    return { ok: true };
  }

  // ===========================================
  // 🚀 NEW: Enhanced BOM Features - Phase 1
  // ===========================================

  /**
   * Explode BOM tree để lấy tất cả materials (multi-level BOM)
   * @param bomId BOM ID
   * @param quantity Số lượng sản phẩm cần sản xuất
   * @param bomVersionId BOM version cụ thể (optional)
   * @returns Danh sách materials với số lượng cần thiết
   */
  static async explodeBom(bomId: bigint, quantity: number = 1, bomVersionId?: bigint) {
    const explodedMaterials = new Map();
    
    const processBomLine = async (bomLineId: bigint, requiredQty: number, depth: number = 0) => {
      // Prevent infinite recursion
      if (depth > 10) throw new Error('BOM depth exceeds maximum limit (10 levels)');
      
      const bomLine = await (prisma as any).bomLine.findUnique({
        where: { id: bomLineId },
        include: { 
          item: true,
          subBom: {
            include: { lines: true }
          }
        }
      });

      if (!bomLine) return;

      const effectiveQty = requiredQty * Number(bomLine.qtyPerUnit) * (1 + Number(bomLine.wastagePercent || 0) / 100);

      // Nếu có sub-bom thì explode tiếp
      if (bomLine.subBomId && bomLine.subBom && bomLine.subBom.lines) {
        for (const subLine of bomLine.subBom.lines) {
          await processBomLine(subLine.id, effectiveQty, depth + 1);
        }
      } else {
        // Đây là raw material, tính tổng requirement
        const currentQty = explodedMaterials.get(bomLine.itemId.toString()) || 0;
        explodedMaterials.set(bomLine.itemId.toString(), currentQty + effectiveQty);
      }
    };

    // Lấy BOM lines để explode
    const bomLines = await prisma.bomLine.findMany({
      where: { bomId },
      orderBy: { id: 'asc' }
    });

    // Process từng line
    for (const line of bomLines) {
      await processBomLine(line.id, quantity);
    }

    // Chuyển đổi thành array với thông tin chi tiết
    const items = [];
    for (const [itemId, qty] of explodedMaterials.entries()) {
      const item = await prisma.item.findUnique({ where: { id: BigInt(itemId) } });
      if (item) {
        items.push({
          itemId: itemId,
          itemName: item.name,
          sku: item.sku,
          uom: item.baseUom || 'pcs',
          qtyRequired: qty,
          itemType: item.itemType
        });
      }
    }

    return {
      items,
      totalItems: items.length,
      quantity
    };
  }

  /**
   * Tạo BOM version mới
   */
  static async createVersion(bomId: bigint, versionData: any) {
    const bom = await this.get(bomId);
    
    // Kiểm tra version đã tồn tại chưa
    const existingVersion = await (prisma as any).bomVersion.findUnique({
      where: {
        bomId_versionNo: {
          bomId,
          versionNo: versionData.versionNo
        }
      }
    });

    if (existingVersion) {
      throw new Error(`BOM version ${versionData.versionNo} already exists`);
    }

    return prisma.$transaction(async (tx) => {
      const version = await (tx as any).bomVersion.create({
        data: {
          bomId,
          versionNo: versionData.versionNo,
          description: versionData.description,
          effectiveFrom: versionData.effectiveFrom ? new Date(versionData.effectiveFrom) : null,
          parentVersionId: versionData.parentVersionId,
          status: 'DRAFT',
          createdById: versionData.createdById
        }
      });

      return { id: version.id.toString(), versionNo: version.versionNo };
    });
  }

  /**
   * Submit BOM version để approve
   */
  static async submitForApproval(versionId: bigint, approvers: bigint[]) {
    return prisma.$transaction(async (tx) => {
      // Cập nhật version status
      await (tx as any).bomVersion.update({
        where: { id: versionId },
        data: { status: 'PENDING_APPROVAL' }
      });

      // Tạo approval records
      await (tx as any).bomApproval.createMany({
        data: approvers.map(approverId => ({
          bomVersionId: versionId,
          approverId,
          status: 'PENDING'
        }))
      });

      return { ok: true };
    });
  }

  /**
   * Approve BOM version
   */
  static async approveVersion(versionId: bigint, approverId: bigint, comments?: string) {
    return prisma.$transaction(async (tx) => {
      // Cập nhật approval status
      await (tx as any).bomApproval.update({
        where: {
          bomVersionId_approverId: {
            bomVersionId: versionId,
            approverId
          }
        },
        data: {
          status: 'APPROVED',
          comments,
          approvedAt: new Date()
        }
      });

      // Kiểm tra xem tất cả approvers đã approve chưa
      const allApprovals = await (tx as any).bomApproval.findMany({
        where: { bomVersionId: versionId }
      });

      const allApproved = allApprovals.every((a: any) => a.status === 'APPROVED');
      const anyRejected = allApprovals.some((a: any) => a.status === 'REJECTED');

      if (allApproved) {
        // Set version thành APPROVED
        await (tx as any).bomVersion.update({
          where: { id: versionId },
          data: {
            status: 'APPROVED',
            approvedById: approverId,
            approvedAt: new Date()
          }
        });

        // Set version này thành current version
        const version = await (tx as any).bomVersion.findUnique({
          where: { id: versionId }
        });

        if (version) {
          // Unset other current versions
          await (tx as any).bomVersion.updateMany({
            where: {
              bomId: version.bomId,
              isCurrent: true,
              id: { not: versionId }
            },
            data: { isCurrent: false }
          });

          // Set version này thành current
          await (tx as any).bomVersion.update({
            where: { id: versionId },
            data: { isCurrent: true }
          });
        }
      } else if (anyRejected) {
        // Set version thành REJECTED
        await (tx as any).bomVersion.update({
          where: { id: versionId },
          data: { status: 'REJECTED' }
        });
      }

      return { ok: true };
    });
  }

  /**
   * Reject BOM version
   */
  static async rejectVersion(versionId: bigint, approverId: bigint, comments?: string) {
    return prisma.$transaction(async (tx) => {
      // Cập nhật approval status
      await (tx as any).bomApproval.update({
        where: {
          bomVersionId_approverId: {
            bomVersionId: versionId,
            approverId
          }
        },
        data: {
          status: 'REJECTED',
          comments,
          approvedAt: new Date()
        }
      });

      // Set version thành REJECTED
      await (tx as any).bomVersion.update({
        where: { id: versionId },
        data: { status: 'REJECTED' }
      });

      return { ok: true };
    });
  }

  /**
   * Tính toán cost từ BOM
   */
  static async calculateBomCost(bomId: bigint, quantity: number = 1, bomVersionId?: bigint) {
    const explodedMaterials = await this.explodeBom(bomId, quantity, bomVersionId);
    
    let totalMaterialCost = 0;
    const materialCosts = [];

    for (const material of explodedMaterials.items) {
      // TODO: Lấy cost từ item purchase history hoặc standard cost
      const unitCost = await this.getItemUnitCost(material.itemId);
      const totalCost = material.qtyRequired * unitCost;
      
      totalMaterialCost += totalCost;
      materialCosts.push({
        ...material,
        unitCost,
        totalCost
      });
    }

    return {
      totalMaterialCost,
      materialCosts,
      quantity
    };
  }

  /**
   * Tính toán lead time từ BOM
   */
  static async calculateBomLeadTime(bomId: bigint, bomVersionId?: bigint) {
    const bom = await prisma.bom.findUnique({
      where: { id: bomId },
      include: {
        lines: {
          include: { item: true },
          orderBy: { id: 'asc' }
        }
      }
    });

    if (!bom) throw new Error('BOM not found');

    let maxLeadTime = 0;
    let totalLeadTime = 0;

    const lines = (bom as any).lines || [];
    for (const line of lines) {
      const itemLeadTime = line.leadTimeDays || 0; // TODO: Get from item master data
      const wastageBuffer = Number(line.wastagePercent) > 0 ? 1 : 0; // Add buffer for wastage
      const lineLeadTime = itemLeadTime + wastageBuffer;
      
      maxLeadTime = Math.max(maxLeadTime, lineLeadTime);
      totalLeadTime += lineLeadTime;
    }

    return {
      maxLeadTime,
      totalLeadTime,
      estimatedDays: maxLeadTime
    };
  }

  /**
   * BOM Templates operations
   */
  static async createTemplate(templateData: any) {
    const template = await (prisma as any).bomTemplate.create({
      data: {
        name: templateData.name,
        code: templateData.code,
        description: templateData.description,
        category: templateData.category,
        templateData: templateData.templateData
      }
    });

    return { id: template.id.toString() };
  }

  static async getTemplate(templateId: bigint) {
    const template = await (prisma as any).bomTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) throw new Error('Template not found');

    return {
      ...template,
      id: template.id.toString(),
      usageCount: template.usageCount.toString()
    };
  }

  static async createBomFromTemplate(templateId: bigint, bomData: any) {
    const template = await this.getTemplate(BigInt(templateId));
    
    return prisma.$transaction(async (tx) => {
      // Tạo BOM mới
      const bom = await tx.bom.create({
        data: {
          code: bomData.code,
          productStyleId: bomData.productStyleId,
          name: bomData.name,
          isActive: bomData.isActive ?? true
        }
      });

      // Tạo BOM lines từ template
      const templateLines = template.templateData.lines || [];
      await tx.bomLine.createMany({
        data: templateLines.map((line: any, index: number) => ({
          bomId: bom.id,
          itemId: line.itemId,
          uom: line.uom || 'pcs',
          qtyPerUnit: new Prisma.Decimal(line.qtyPerUnit),
          wastagePercent: new Prisma.Decimal(line.wastagePercent || 0),
          note: line.note ?? null,
          isOptional: line.isOptional || false,
          leadTimeDays: line.leadTimeDays || 0
        }))
      });

      // Tăng usage count
      await (tx as any).bomTemplate.update({
        where: { id: BigInt(templateId) },
        data: {
          usageCount: { increment: 1 }
        }
      });

      return { id: bom.id.toString() };
    });
  }

  /**
   * Helper method: Lấy unit cost của item
   */
  private static async getItemUnitCost(itemId: string): Promise<number> {
    try {
      // TODO: Implement logic để lấy cost từ:
      // 1. Purchase history (last purchase price) 
      // 2. Standard cost
      // 3. Vendor price list
      
      // Tạm thời return 0 - sẽ implement sau khi có đủ data
      return 0;
    } catch (error) {
      console.error('Error getting item unit cost:', error);
      return 0;
    }
  }

  /**
   * List all BOM templates
   */
  static async listTemplates(query: any = {}) {
    const where: any = {};
    
    if (query.category) {
      where.category = query.category;
    }
    
    if (query.q) {
      where.OR = [
        { name: { contains: query.q } },
        { code: { contains: query.q } },
        { description: { contains: query.q } }
      ];
    }

    const [total, templates] = await prisma.$transaction([
      prisma.bomTemplate.count({ where }),
      prisma.bomTemplate.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (query.page - 1) * (query.pageSize || 20),
        take: query.pageSize || 20,
      }),
    ]);

    return {
      page: query.page || 1,
      pageSize: query.pageSize || 20,
      total,
      items: templates.map((t) => ({
        ...t,
        id: t.id.toString(),
        usageCount: t.usageCount ? t.usageCount.toString() : '0',
      })),
    };
  }

  /**
   * BOM Version comparison
   */
  static async compareVersions(versionId1: bigint, versionId2: bigint) {
    const [version1, version2] = await Promise.all([
      (prisma as any).bomVersion.findUnique({
        where: { id: versionId1 },
        include: { bom: { include: { lines: { include: { item: true } } } } }
      }),
      (prisma as any).bomVersion.findUnique({
        where: { id: versionId2 },
        include: { bom: { include: { lines: { include: { item: true } } } } }
      })
    ]);

    if (!version1 || !version2) {
      throw new Error('One or both versions not found');
    }

    // TODO: Implement detailed comparison logic
    return {
      version1: {
        id: version1.id.toString(),
        versionNo: version1.versionNo,
        status: version1.status
      },
      version2: {
        id: version2.id.toString(),
        versionNo: version2.versionNo,
        status: version2.status
      },
      differences: [] // TODO: Implement comparison
    };
  }

  /**
   * Get current BOM version
   */
  static async getCurrentVersion(bomId: bigint) {
    const version = await (prisma as any).bomVersion.findFirst({
      where: {
        bomId,
        isCurrent: true
      },
      include: {
        bom: {
          include: {
            lines: {
              include: { item: true },
              orderBy: { id: 'asc' }
            }
          }
        }
      }
    });

    if (!version) {
      throw new Error('No current version found for this BOM');
    }

    return {
      ...version,
      id: version.id.toString(),
      bomId: version.bomId.toString(),
      bom: {
        ...version.bom,
        id: version.bom.id.toString(),
        lines: version.bom.lines.map((line: any) => ({
          ...line,
          id: line.id.toString(),
          bomId: line.bomId.toString(),
          itemId: line.itemId.toString(),
          item: {
            ...line.item,
            id: line.item.id.toString()
          }
        }))
      }
    };
  }
}
