import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import { Prisma } from "@prisma/client";

const mapId = (x: any) => ({ ...x, id: x.id.toString() });

export class SalesOrdersService {
  static async syncStatusByProduction(tx: Prisma.TransactionClient, salesOrderId: bigint) {
    // lấy items
    const items = await tx.salesOrderItem.findMany({
      where: { salesOrderId },
      select: { id: true, qtyTotal: true },
    });
    if (!items.length) return;

    const itemIds = items.map((x) => x.id);

    // gom qtyDone theo salesOrderItemId
    const agg = await tx.productionOrder.groupBy({
      by: ["salesOrderItemId"],
      where: { salesOrderItemId: { in: itemIds }, status: { in: ["RUNNING", "DONE"] } },
      _sum: { qtyDone: true },
    });

    const doneMap = new Map<string, Prisma.Decimal>();
    for (const a of agg) {
      if (!a.salesOrderItemId) continue;
      doneMap.set(a.salesOrderItemId.toString(), a._sum.qtyDone ?? new Prisma.Decimal(0));
    }

    // rule 1: có MO RUNNING/DONE => IN_PRODUCTION (nếu đang CONFIRMED)
    const hasRunningOrDone = agg.length > 0;

    // rule 2: tất cả items đủ qty => DONE
    const allItemsDone = items.every((it) => {
      const done = doneMap.get(it.id.toString()) ?? new Prisma.Decimal(0);
      return done.gte(it.qtyTotal);
    });

    const so = await tx.salesOrder.findUnique({
      where: { id: salesOrderId },
      select: { status: true },
    });
    if (!so) return;

    // Không động vào CANCELLED
    if (so.status === "CANCELLED") return;

    if (allItemsDone) {
      if (so.status !== "DONE") {
        await tx.salesOrder.update({ where: { id: salesOrderId }, data: { status: "DONE" } });
      }
      return;
    }

    if (hasRunningOrDone && so.status === "CONFIRMED") {
      await tx.salesOrder.update({ where: { id: salesOrderId }, data: { status: "IN_PRODUCTION" } });
    }
  }
  static async list(q: any) {
    const where: Prisma.SalesOrderWhereInput = {};

    const AND: Prisma.SalesOrderWhereInput[] = [];
    if (q.q) AND.push({ OR: [{ orderNo: { contains: q.q } }] });
    if (q.customerId) AND.push({ customerId: q.customerId });
    if (q.status) AND.push({ status: q.status });
    if (q.fromDate) AND.push({ orderDate: { gte: q.fromDate } });
    if (q.toDate) AND.push({ orderDate: { lte: q.toDate } });
    if (AND.length) where.AND = AND;

    const [total, rows] = await prisma.$transaction([
      prisma.salesOrder.count({ where }),
      prisma.salesOrder.findMany({
        where,
        orderBy: { [q.sortBy]: q.sortOrder },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        include: { customer: true },
      }),
    ]);

    return {
      page: q.page,
      pageSize: q.pageSize,
      total,
      items: rows.map((r) => ({
        ...r,
        id: r.id.toString(),
        customerId: r.customerId.toString(),
        createdById: r.createdById?.toString() ?? null,
        customer: mapId(r.customer),
      })),
    };
  }

  static async get(id: bigint) {
    const so = await prisma.salesOrder.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          orderBy: { lineNo: "asc" },
          include: {
            productStyle: true,
            breakdowns: {
              include: {
                productVariant: { include: { size: true, color: true, productStyle: true } },
              },
            },
          },
        },
      },
    });
    if (!so) throw E.notFound("Sales order not found");

    return {
      ...so,
      id: so.id.toString(),
      customerId: so.customerId.toString(),
      createdById: so.createdById?.toString() ?? null,
      customer: mapId(so.customer),
      items: so.items.map((it) => ({
        ...it,
        id: it.id.toString(),
        salesOrderId: it.salesOrderId.toString(),
        productStyleId: it.productStyleId.toString(),
        productStyle: mapId(it.productStyle),
        breakdowns: it.breakdowns.map((bd) => ({
          ...bd,
          id: bd.id.toString(),
          salesOrderItemId: bd.salesOrderItemId.toString(),
          productVariantId: bd.productVariantId.toString(),
          productVariant: {
            ...bd.productVariant,
            id: bd.productVariant.id.toString(),
            productStyleId: bd.productVariant.productStyleId.toString(),
            sizeId: bd.productVariant.sizeId.toString(),
            colorId: bd.productVariant.colorId.toString(),
            size: mapId(bd.productVariant.size),
            color: mapId(bd.productVariant.color),
            productStyle: mapId(bd.productVariant.productStyle),
          },
        })),
      })),
    };
  }

  static async create(userId: bigint | null, data: any) {
    return prisma.$transaction(async (tx) => {
      const so = await tx.salesOrder.create({
        data: {
          orderNo: data.orderNo,
          customerId: data.customerId,
          createdById: userId,
          orderDate: data.orderDate,
          dueDate: data.dueDate,
          status: data.status ?? "DRAFT",
          note: data.note,
          isInternal: data.isInternal ?? false,
          items: {
            create: data.items.map((it: any) => {
              const qtyTotal = new Prisma.Decimal(it.qtyTotal);
              const unitPrice = new Prisma.Decimal(it.unitPrice);
              const amount = qtyTotal.mul(unitPrice);

              return {
                lineNo: it.lineNo,
                productStyleId: it.productStyleId,
                itemName: it.itemName,
                uom: it.uom ?? "pcs",
                qtyTotal,
                unitPrice,
                amount,
                note: it.note,
                breakdowns: it.breakdowns
                  ? {
                      create: it.breakdowns.map((bd: any) => ({
                        productVariantId: bd.productVariantId,
                        qty: new Prisma.Decimal(bd.qty),
                      })),
                    }
                  : undefined,
              };
            }),
          },
        },
      });

      return { id: so.id.toString() };
    });
  }

  static async update(id: bigint, userId: bigint | null, data: any) {
    await this.get(id);
  
    return prisma.$transaction(async (tx) => {
      await tx.salesOrder.update({
        where: { id },
        data: {
          ...(data.customerId !== undefined ? { customerId: data.customerId } : {}),
          ...(data.orderDate !== undefined ? { orderDate: data.orderDate } : {}),
          ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
          ...(data.status !== undefined ? { status: data.status } : {}),
          ...(data.note !== undefined ? { note: data.note } : {}),
          ...(data.isInternal !== undefined ? { isInternal: data.isInternal } : {}),
          ...(userId !== null ? { createdById: userId } : {}), // ✅ không dùng ?? undefined
        },
      });
  
      // ✅ replace items nếu được gửi (kể cả [])
      if (data.items !== undefined) {
        const existingItems = await tx.salesOrderItem.findMany({
          where: { salesOrderId: id },
          select: { id: true },
        });
        const itemIds = existingItems.map((x) => x.id);
  
        if (itemIds.length) {
          await tx.soItemVariantBreakdown.deleteMany({
            where: { salesOrderItemId: { in: itemIds } },
          });
          await tx.salesOrderItem.deleteMany({
            where: { id: { in: itemIds } },
          });
        }
  
        if (data.items.length) {
          await tx.salesOrderItem.createMany({
            data: data.items.map((it: any) => {
              const qtyTotal = new Prisma.Decimal(it.qtyTotal);
              const unitPrice = new Prisma.Decimal(it.unitPrice);
              const amount = qtyTotal.mul(unitPrice);
  
              return {
                salesOrderId: id,
                lineNo: it.lineNo,
                productStyleId: it.productStyleId,
                itemName: it.itemName,
                uom: it.uom ?? "pcs",
                qtyTotal,
                unitPrice,
                amount,
                note: it.note,
              };
            }),
          });
  
          for (const it of data.items) {
            if (!it.breakdowns?.length) continue;
  
            const itemRow = await tx.salesOrderItem.findUnique({
              where: { salesOrderId_lineNo: { salesOrderId: id, lineNo: it.lineNo } },
              select: { id: true },
            });
            if (!itemRow) continue;
  
            await tx.soItemVariantBreakdown.createMany({
              data: it.breakdowns.map((bd: any) => ({
                salesOrderItemId: itemRow.id,
                productVariantId: bd.productVariantId,
                qty: new Prisma.Decimal(bd.qty),
              })),
            });
          }
        }
      }
  
      return { ok: true };
    });
  }
  
  static async remove(id: bigint) {
    await this.get(id);
    await prisma.salesOrder.delete({ where: { id } });
    return { ok: true };
  }

  static async confirm(id: bigint) {
    return prisma.$transaction(async (tx) => {
      const so = await tx.salesOrder.findUnique({ where: { id }, select: { id: true, status: true } });
      if (!so) throw E.notFound("Sales order not found");
      if (so.status !== "DRAFT") throw E.badRequest("Only DRAFT sales order can be confirmed");
  
      await tx.salesOrder.update({ where: { id }, data: { status: "CONFIRMED" } });
      return { ok: true };
    });
  }
  
  static async cancel(id: bigint) {
    return prisma.$transaction(async (tx) => {
      const so = await tx.salesOrder.findUnique({ where: { id }, select: { id: true, status: true } });
      if (!so) throw E.notFound("Sales order not found");
  
      if (so.status === "DONE") throw E.badRequest("Cannot cancel a DONE sales order");
      if (so.status === "CANCELLED") return { ok: true };
  
      await tx.salesOrder.update({ where: { id }, data: { status: "CANCELLED" } });
      return { ok: true };
    });
  }
  
}
