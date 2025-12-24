import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import { Prisma } from "@prisma/client";

const mapId = (x: any) => ({ ...x, id: x.id.toString() });

export class ProductionOrdersService {
  static async list(q: any) {
    const where: Prisma.ProductionOrderWhereInput = {};
    const AND: Prisma.ProductionOrderWhereInput[] = [];
    if (q.q) AND.push({ moNo: { contains: q.q } });
    if (q.status) AND.push({ status: q.status });
    if (q.productStyleId) AND.push({ productStyleId: q.productStyleId });
    if (AND.length) where.AND = AND;

    const [total, rows] = await prisma.$transaction([
      prisma.productionOrder.count({ where }),
      prisma.productionOrder.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        include: { productStyle: true },
      }),
    ]);

    return {
      page: q.page,
      pageSize: q.pageSize,
      total,
      items: rows.map((r) => ({
        ...r,
        id: r.id.toString(),
        salesOrderItemId: r.salesOrderItemId?.toString() ?? null,
        productStyleId: r.productStyleId.toString(),
        createdById: r.createdById?.toString() ?? null,
        productStyle: mapId(r.productStyle),
      })),
    };
  }

  static async get(id: bigint) {
    const mo = await prisma.productionOrder.findUnique({
      where: { id },
      include: {
        productStyle: true,
        breakdowns: { include: { productVariant: { include: { size: true, color: true } } } },
        materialRequirements: { include: { item: true } },
      },
    });
    if (!mo) throw E.notFound("Production order not found");

    return {
      ...mo,
      id: mo.id.toString(),
      salesOrderItemId: mo.salesOrderItemId?.toString() ?? null,
      productStyleId: mo.productStyleId.toString(),
      createdById: mo.createdById?.toString() ?? null,
      productStyle: mapId(mo.productStyle),
      breakdowns: mo.breakdowns.map((b) => ({
        ...b,
        id: b.id.toString(),
        productionOrderId: b.productionOrderId.toString(),
        productVariantId: b.productVariantId.toString(),
        productVariant: {
          ...b.productVariant,
          id: b.productVariant.id.toString(),
          productStyleId: b.productVariant.productStyleId.toString(),
          sizeId: b.productVariant.sizeId.toString(),
          colorId: b.productVariant.colorId.toString(),
          size: mapId(b.productVariant.size),
          color: mapId(b.productVariant.color),
        },
      })),
      materialRequirements: mo.materialRequirements.map((m) => ({
        ...m,
        id: m.id.toString(),
        productionOrderId: m.productionOrderId.toString(),
        itemId: m.itemId.toString(),
        item: mapId(m.item),
      })),
    };
  }

  static async create(userId: bigint | null, data: any) {
    return prisma.$transaction(async (tx) => {
      const mo = await tx.productionOrder.create({
        data: {
          moNo: data.moNo,
          productStyleId: data.productStyleId,
          qtyPlan: new Prisma.Decimal(data.qtyPlan),
          qtyDone: new Prisma.Decimal(0),
          status: data.status ?? "DRAFT",
  
          ...(data.salesOrderItemId !== undefined ? { salesOrderItemId: data.salesOrderItemId } : {}),
          ...(userId !== null ? { createdById: userId } : {}), // ✅ không đưa undefined
          ...(data.startDate !== undefined ? { startDate: data.startDate } : {}),
          ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
          ...(data.note !== undefined ? { note: data.note } : {}),
  
          // ✅ nếu client gửi breakdowns (kể cả []) thì xử lý theo ý bạn:
          ...(data.breakdowns !== undefined
            ? {
                breakdowns: {
                  create: data.breakdowns.map((b: any) => ({
                    productVariantId: b.productVariantId,
                    qtyPlan: new Prisma.Decimal(b.qtyPlan),
                    qtyDone: new Prisma.Decimal(b.qtyDone ?? 0),
                  })),
                },
              }
            : {}),
  
          ...(data.materialRequirements !== undefined
            ? {
                materialRequirements: {
                  create: data.materialRequirements.map((m: any) => ({
                    itemId: m.itemId,
                    uom: m.uom ?? "pcs",
                    qtyRequired: new Prisma.Decimal(m.qtyRequired),
                    qtyIssued: new Prisma.Decimal(m.qtyIssued ?? 0),
                    wastagePercent: new Prisma.Decimal(m.wastagePercent ?? 0),
                  })),
                },
              }
            : {}),
        },
      });
  
      return { id: mo.id.toString() };
    });
  }
  
  static async update(id: bigint, userId: bigint | null, data: any) {
    await this.get(id);
  
    return prisma.$transaction(async (tx) => {
      await tx.productionOrder.update({
        where: { id },
        data: {
          ...(data.salesOrderItemId !== undefined ? { salesOrderItemId: data.salesOrderItemId } : {}),
          ...(data.productStyleId !== undefined ? { productStyleId: data.productStyleId } : {}),
          ...(data.qtyPlan !== undefined ? { qtyPlan: new Prisma.Decimal(data.qtyPlan) } : {}),
          ...(data.startDate !== undefined ? { startDate: data.startDate } : {}),
          ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
          ...(data.status !== undefined ? { status: data.status } : {}),
          ...(data.note !== undefined ? { note: data.note } : {}),
          ...(userId !== null ? { createdById: userId } : {}),
        },
      });
  
      // ✅ replace breakdowns (kể cả [])
      if (data.breakdowns !== undefined) {
        await tx.productionOrderBreakdown.deleteMany({ where: { productionOrderId: id } });
  
        if (data.breakdowns.length) {
          await tx.productionOrderBreakdown.createMany({
            data: data.breakdowns.map((b: any) => ({
              productionOrderId: id,
              productVariantId: b.productVariantId,
              qtyPlan: new Prisma.Decimal(b.qtyPlan),
              qtyDone: new Prisma.Decimal(b.qtyDone ?? 0),
            })),
          });
        }
      }
  
      // ✅ replace materialRequirements (kể cả [])
      if (data.materialRequirements !== undefined) {
        await tx.moMaterialRequirement.deleteMany({ where: { productionOrderId: id } });
  
        if (data.materialRequirements.length) {
          await tx.moMaterialRequirement.createMany({
            data: data.materialRequirements.map((m: any) => ({
              productionOrderId: id,
              itemId: m.itemId,
              uom: m.uom ?? "pcs",
              qtyRequired: new Prisma.Decimal(m.qtyRequired),
              qtyIssued: new Prisma.Decimal(m.qtyIssued ?? 0),
              wastagePercent: new Prisma.Decimal(m.wastagePercent ?? 0),
            })),
          });
        }
      }
  
      return { ok: true };
    });
  }
  
  static async remove(id: bigint) {
    await this.get(id);
    await prisma.productionOrder.delete({ where: { id } });
    return { ok: true };
  }

  static async generateMaterialsFromBom(id: bigint, mode: "replace" | "merge" = "replace") {
    return prisma.$transaction(async (tx) => {
      // 1) Lấy MO
      const mo = await tx.productionOrder.findUnique({
        where: { id },
        select: { id: true, productStyleId: true, qtyPlan: true },
      });
      if (!mo) throw E.notFound("Production order not found");
  
      // 2) Lấy BOM theo productStyleId (ưu tiên isActive=true, mới nhất)
      const bom = await tx.bom.findFirst({
        where: { productStyleId: mo.productStyleId, isActive: true },
        orderBy: { updatedAt: "desc" },
        include: { lines: true },
      });
      if (!bom) throw E.badRequest("No active BOM found for this product style");
  
      if (!bom.lines.length) {
        // không có lines => requirements rỗng
        if (mode === "replace") {
          await tx.moMaterialRequirement.deleteMany({ where: { productionOrderId: id } });
        }
        return {
          ok: true,
          mode,
          productionOrderId: id.toString(),
          bomId: bom.id.toString(),
          items: [],
        };
      }
  
      // helper Decimal
      const plan = new Prisma.Decimal(mo.qtyPlan);
  
      // 3) Tính requirements
      const computed = bom.lines.map((l) => {
        const qtyPerUnit = new Prisma.Decimal(l.qtyPerUnit);
        const wastage = new Prisma.Decimal(l.wastagePercent ?? 0);
        const factor = new Prisma.Decimal(1).add(wastage.div(100));
        const qtyRequired = plan.mul(qtyPerUnit).mul(factor);
  
        return {
          itemId: l.itemId,
          uom: l.uom ?? "pcs",
          qtyRequired,
          wastagePercent: wastage,
        };
      });
  
      // 4) Ghi DB theo mode
      if (mode === "replace") {
        await tx.moMaterialRequirement.deleteMany({ where: { productionOrderId: id } });
  
        await tx.moMaterialRequirement.createMany({
          data: computed.map((c) => ({
            productionOrderId: id,
            itemId: c.itemId,
            uom: c.uom,
            qtyRequired: c.qtyRequired,
            qtyIssued: new Prisma.Decimal(0),
            wastagePercent: c.wastagePercent,
          })),
        });
      } else {
        // merge: upsert từng item theo unique(productionOrderId,itemId), giữ qtyIssued hiện có
        for (const c of computed) {
          await tx.moMaterialRequirement.upsert({
            where: {
              productionOrderId_itemId: {
                productionOrderId: id,
                itemId: c.itemId,
              },
            },
            create: {
              productionOrderId: id,
              itemId: c.itemId,
              uom: c.uom,
              qtyRequired: c.qtyRequired,
              qtyIssued: new Prisma.Decimal(0),
              wastagePercent: c.wastagePercent,
            },
            update: {
              uom: c.uom,
              qtyRequired: c.qtyRequired,
              wastagePercent: c.wastagePercent,
              // qtyIssued: giữ nguyên
            },
          });
        }
      }
  
      // 5) Trả kết quả (include item name cho FE)
      const rows = await tx.moMaterialRequirement.findMany({
        where: { productionOrderId: id },
        include: { item: true },
        orderBy: { id: "asc" },
      });
  
      return {
        ok: true,
        mode,
        productionOrderId: id.toString(),
        bomId: bom.id.toString(),
        items: rows.map((r) => ({
          id: r.id.toString(),
          productionOrderId: r.productionOrderId.toString(),
          itemId: r.itemId.toString(),
          uom: r.uom,
          qtyRequired: r.qtyRequired,
          qtyIssued: r.qtyIssued,
          wastagePercent: r.wastagePercent,
          item: { ...r.item, id: r.item.id.toString() },
        })),
      };
    });
  }
  
  static async release(id: bigint) {
    return prisma.$transaction(async (tx) => {
      const mo = await tx.productionOrder.findUnique({ where: { id }, select: { status: true } });
      if (!mo) throw E.notFound("Production order not found");
      if (mo.status !== "DRAFT") throw E.badRequest("Only DRAFT production order can be released");
  
      await tx.productionOrder.update({ where: { id }, data: { status: "RELEASED" } });
      return { ok: true };
    });
  }
  
  static async start(id: bigint) {
    return prisma.$transaction(async (tx) => {
      const mo = await tx.productionOrder.findUnique({ where: { id }, select: { status: true } });
      if (!mo) throw E.notFound("Production order not found");
      if (mo.status !== "RELEASED") throw E.badRequest("Only RELEASED production order can be started");
  
      await tx.productionOrder.update({ where: { id }, data: { status: "RUNNING" } });
      return { ok: true };
    });
  }
  
  static async done(id: bigint) {
    return prisma.$transaction(async (tx) => {
      const mo = await tx.productionOrder.findUnique({ where: { id }, select: { status: true } });
      if (!mo) throw E.notFound("Production order not found");
      if (mo.status !== "RUNNING") throw E.badRequest("Only RUNNING production order can be done");
  
      await tx.productionOrder.update({ where: { id }, data: { status: "DONE" } });
      return { ok: true };
    });
  }
  
  static async cancel(id: bigint) {
    return prisma.$transaction(async (tx) => {
      const mo = await tx.productionOrder.findUnique({ where: { id }, select: { status: true } });
      if (!mo) throw E.notFound("Production order not found");
  
      if (mo.status === "DONE") throw E.badRequest("Cannot cancel a DONE production order");
      if (mo.status === "CANCELLED") return { ok: true };
  
      await tx.productionOrder.update({ where: { id }, data: { status: "CANCELLED" } });
      return { ok: true };
    });
  }
  
}
