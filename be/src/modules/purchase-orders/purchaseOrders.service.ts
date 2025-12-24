import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import { Prisma } from "@prisma/client";

const mapId = (x: any) => ({ ...x, id: x.id.toString() });

export class PurchaseOrdersService {
  static async list(q: any) {
    const where: Prisma.PurchaseOrderWhereInput = {};
    const AND: Prisma.PurchaseOrderWhereInput[] = [];
    if (q.q) AND.push({ poNo: { contains: q.q } });
    if (q.supplierId) AND.push({ supplierId: q.supplierId });
    if (q.status) AND.push({ status: q.status });
    if (q.fromDate) AND.push({ orderDate: { gte: q.fromDate } });
    if (q.toDate) AND.push({ orderDate: { lte: q.toDate } });
    if (AND.length) where.AND = AND;

    const [total, rows] = await prisma.$transaction([
      prisma.purchaseOrder.count({ where }),
      prisma.purchaseOrder.findMany({
        where,
        orderBy: { orderDate: "desc" },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        include: { supplier: true },
      }),
    ]);

    return {
      page: q.page,
      pageSize: q.pageSize,
      total,
      items: rows.map((r) => ({
        ...r,
        id: r.id.toString(),
        supplierId: r.supplierId.toString(),
        createdById: r.createdById?.toString() ?? null,
        supplier: mapId(r.supplier),
      })),
    };
  }

  static async get(id: bigint) {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        lines: { orderBy: { lineNo: "asc" }, include: { item: true } },
      },
    });
    if (!po) throw E.notFound("Purchase order not found");

    return {
      ...po,
      id: po.id.toString(),
      supplierId: po.supplierId.toString(),
      createdById: po.createdById?.toString() ?? null,
      supplier: mapId(po.supplier),
      lines: po.lines.map((l) => ({
        ...l,
        id: l.id.toString(),
        purchaseOrderId: l.purchaseOrderId.toString(),
        itemId: l.itemId.toString(),
        item: mapId(l.item),
      })),
    };
  }

  static async create(userId: bigint | null, data: any) {
    return prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.create({
        data: {
          poNo: data.poNo,
          supplierId: data.supplierId,
          createdById: userId,
          orderDate: data.orderDate,
          status: data.status ?? "DRAFT",
          note: data.note,
          lines: {
            create: data.lines.map((l: any) => {
              const qty = new Prisma.Decimal(l.qty);
              const unitPrice = new Prisma.Decimal(l.unitPrice);
              const amount = qty.mul(unitPrice);
              return {
                lineNo: l.lineNo,
                itemId: l.itemId,
                uom: l.uom ?? "pcs",
                qty,
                unitPrice,
                amount,
              };
            }),
          },
        },
      });

      return { id: po.id.toString() };
    });
  }

  static async update(id: bigint, userId: bigint | null, data: any) {
    await this.get(id);
  
    return prisma.$transaction(async (tx) => {
      await tx.purchaseOrder.update({
        where: { id },
        data: {
          ...(data.supplierId !== undefined ? { supplierId: data.supplierId } : {}),
          ...(data.orderDate !== undefined ? { orderDate: data.orderDate } : {}),
          ...(data.status !== undefined ? { status: data.status } : {}),
          ...(data.note !== undefined ? { note: data.note } : {}),
          ...(userId !== null ? { createdById: userId } : {}),
        },
      });
  
      // ✅ replace lines: dùng !== undefined để nhận cả []
      if (data.lines !== undefined) {
        await tx.purchaseOrderLine.deleteMany({ where: { purchaseOrderId: id } });
  
        if (data.lines.length) {
          await tx.purchaseOrderLine.createMany({
            data: data.lines.map((l: any) => {
              const qty = new Prisma.Decimal(l.qty);
              const unitPrice = new Prisma.Decimal(l.unitPrice);
              const amount = qty.mul(unitPrice);
              return {
                purchaseOrderId: id,
                lineNo: l.lineNo,
                itemId: l.itemId,
                uom: l.uom ?? "pcs",
                qty,
                unitPrice,
                amount,
              };
            }),
          });
        }
      }
  
      return { ok: true };
    });
  }
  

  static async remove(id: bigint) {
    await this.get(id);
    await prisma.purchaseOrder.delete({ where: { id } });
    return { ok: true };
  }
  static async confirm(id: bigint) {
    return prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.findUnique({ where: { id }, select: { status: true } });
      if (!po) throw E.notFound("Purchase order not found");
      if (po.status !== "DRAFT") throw E.badRequest("Only DRAFT purchase order can be confirmed");
  
      await tx.purchaseOrder.update({ where: { id }, data: { status: "CONFIRMED" } });
      return { ok: true };
    });
  }
  
  static async receiving(id: bigint) {
    return prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.findUnique({ where: { id }, select: { status: true } });
      if (!po) throw E.notFound("Purchase order not found");
      if (po.status !== "CONFIRMED") throw E.badRequest("Only CONFIRMED purchase order can move to RECEIVING");
  
      await tx.purchaseOrder.update({ where: { id }, data: { status: "RECEIVING" } });
      return { ok: true };
    });
  }
  
  static async received(id: bigint) {
    return prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.findUnique({ where: { id }, select: { status: true } });
      if (!po) throw E.notFound("Purchase order not found");
      if (po.status !== "RECEIVING") throw E.badRequest("Only RECEIVING purchase order can be set to RECEIVED");
  
      await tx.purchaseOrder.update({ where: { id }, data: { status: "RECEIVED" } });
      return { ok: true };
    });
  }
  
  static async cancel(id: bigint) {
    return prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.findUnique({ where: { id }, select: { status: true } });
      if (!po) throw E.notFound("Purchase order not found");
  
      if (po.status === "RECEIVED") throw E.badRequest("Cannot cancel a RECEIVED purchase order");
      if (po.status === "CANCELLED") return { ok: true };
  
      await tx.purchaseOrder.update({ where: { id }, data: { status: "CANCELLED" } });
      return { ok: true };
    });
  }
  
}
