import { E } from "../../common/errors";
import { prisma } from "../../db/prisma";
import { Prisma } from "@prisma/client";
import { SalesOrdersService } from "../sales-orders/salesOrders.service";

export class StockMovesService {
  private static async applySalesOrderOut(
    tx: Prisma.TransactionClient,
    stockMoveId: bigint
  ) {
    const sm = await tx.stockMove.findUnique({
      where: { id: stockMoveId },
      include: { lines: true, salesOrder: true },
    });
    if (!sm || !sm.salesOrder) return;
  
    if (sm.moveType !== "OUT") {
      throw E.badRequest("Only OUT stock move can deliver a sales order");
    }
  
    // SO phải đã confirm trở lên
    if (sm.salesOrder.status === "DRAFT") {
      throw E.badRequest("Sales order must be CONFIRMED before delivery");
    }
    if (sm.salesOrder.status === "CANCELLED") {
      throw E.badRequest("Cannot deliver a CANCELLED sales order");
    }
  
    // Line OUT theo SO: bắt buộc productVariantId
    for (const l of sm.lines) {
      if (!l.productVariantId || l.itemId) {
        throw E.badRequest("OUT for sales order requires productVariantId only");
      }
    }
  
    // 1) Lấy qty đã đặt theo variant từ breakdown
    const breakdowns = await tx.soItemVariantBreakdown.findMany({
      where: { salesOrderItem: { salesOrderId: sm.salesOrderId! } },
      select: { productVariantId: true, qty: true },
    });
  
    if (!breakdowns.length) {
      throw E.badRequest("Sales order has no variant breakdowns to validate delivery");
    }
  
    const orderedMap = new Map<string, Prisma.Decimal>();
    for (const bd of breakdowns) {
      const key = bd.productVariantId.toString();
      const prev = orderedMap.get(key) ?? new Prisma.Decimal(0);
      orderedMap.set(key, prev.add(bd.qty));
    }
  
    // 2) Tính tổng đã xuất trước đó (OUT POSTED) theo variant
    const deliveredAgg = await tx.stockMoveLine.groupBy({
      by: ["productVariantId"],
      where: {
        stockMove: {
          status: "POSTED",
          moveType: "OUT",
          salesOrderId: sm.salesOrderId!,
        },
        productVariantId: { not: null },
      },
      _sum: { qty: true },
    });
  
    const deliveredMap = new Map<string, Prisma.Decimal>();
    for (const a of deliveredAgg) {
      if (!a.productVariantId) continue;
      deliveredMap.set(a.productVariantId.toString(), a._sum.qty ?? new Prisma.Decimal(0));
    }
  
    // 3) Gom qty của phiếu đang post theo variant
    const thisOutMap = new Map<string, Prisma.Decimal>();
    for (const l of sm.lines) {
      const key = l.productVariantId!.toString();
      const prev = thisOutMap.get(key) ?? new Prisma.Decimal(0);
      thisOutMap.set(key, prev.add(l.qty));
    }
  
    // 4) Validate không vượt ordered
    for (const [variantIdStr, addQty] of thisOutMap.entries()) {
      const ordered = orderedMap.get(variantIdStr);
      if (!ordered) {
        throw E.badRequest(`Variant ${variantIdStr} is not in sales order breakdown`);
      }
  
      const delivered = deliveredMap.get(variantIdStr) ?? new Prisma.Decimal(0);
      const newDelivered = delivered.add(addQty);
  
      if (newDelivered.gt(ordered)) {
        throw E.badRequest(
          `Deliver exceeds ordered for variant ${variantIdStr} (ordered=${ordered.toString()}, delivered=${newDelivered.toString()})`
        );
      }
    }
  
    // 5) Auto DONE nếu giao đủ toàn bộ variants
    // (Lưu ý: deliveredAgg chưa tính phiếu hiện tại vì đang POST, nên ta cộng thêm thisOutMap vào deliveredMap trước khi check)
    for (const [k, addQty] of thisOutMap.entries()) {
      deliveredMap.set(k, (deliveredMap.get(k) ?? new Prisma.Decimal(0)).add(addQty));
    }
  
    const allDelivered = Array.from(orderedMap.entries()).every(([k, ordered]) => {
      const delivered = deliveredMap.get(k) ?? new Prisma.Decimal(0);
      return delivered.gte(ordered);
    });
  
    if (allDelivered && sm.salesOrder.status !== "DONE") {
      await tx.salesOrder.update({
        where: { id: sm.salesOrderId! },
        data: { status: "DONE" },
      });
    }
  }
  
  private static async applyProductionOrderIssue(
    tx: Prisma.TransactionClient,
    stockMoveId: bigint
  ) {
    const sm = await tx.stockMove.findUnique({
      where: { id: stockMoveId },
      include: {
        productionOrder: true,
        lines: true,
      },
    });
  
    if (!sm || !sm.productionOrder) return;
  
    if (sm.moveType !== "ISSUE") {
      throw E.badRequest("Only ISSUE stock move can issue materials for production order");
    }
  
    // ISSUE cho MO: line phải dùng itemId (nguyên liệu), không dùng productVariantId
    for (const l of sm.lines) {
      if (!l.itemId) {
        if (l.productVariantId) {
          throw E.badRequest("ISSUE for production order requires itemId (not productVariantId)");
        }
        throw E.badRequest("ISSUE for production order requires itemId");
      }
    }
  
    // Lấy requirements hiện tại của MO
    const reqs = await tx.moMaterialRequirement.findMany({
      where: { productionOrderId: sm.productionOrderId! },
    });
  
    const reqMap = new Map<string, typeof reqs[number]>();
    for (const r of reqs) reqMap.set(r.itemId.toString(), r);
  
    // Cộng issued từng item
    const issueMap = new Map<string, Prisma.Decimal>();
    for (const l of sm.lines) {
      const key = l.itemId!.toString();
      const prev = issueMap.get(key) ?? new Prisma.Decimal(0);
      issueMap.set(key, prev.add(l.qty));
    }
  
    // Validate + update
    for (const [itemIdStr, addQty] of issueMap.entries()) {
      const req = reqMap.get(itemIdStr);
      if (!req) {
        throw E.badRequest(`Item ${itemIdStr} is not in material requirements of this MO`);
      }
  
      const newIssued = new Prisma.Decimal(req.qtyIssued).add(addQty);
  
      // ✅ chặn vượt required
      if (newIssued.gt(req.qtyRequired)) {
        throw E.badRequest(
          `Issued qty exceeds required for item ${itemIdStr} (required=${req.qtyRequired.toString()}, issued=${newIssued.toString()})`
        );
      }
  
      await tx.moMaterialRequirement.update({
        where: { id: req.id },
        data: { qtyIssued: newIssued },
      });
    }
  }
  
  private static async applyPurchaseOrderReceipt(
    tx: Prisma.TransactionClient,
    stockMoveId: bigint
  ) {
    const sm = await tx.stockMove.findUnique({
      where: { id: stockMoveId },
      include: {
        purchaseOrder: {
          include: { lines: true },
        },
        lines: true,
      },
    });
  
    if (!sm || !sm.purchaseOrder) return;
  
    if (sm.moveType !== "RECEIPT") {
      throw E.badRequest("Only RECEIPT stock move can receive purchase order");
    }
  
    // Map itemId -> total received qty in this stock move
    const receivedMap = new Map<string, Prisma.Decimal>();
  
    for (const l of sm.lines) {
      if (!l.itemId) continue;
  
      const key = l.itemId.toString();
      const prev = receivedMap.get(key) ?? new Prisma.Decimal(0);
      receivedMap.set(key, prev.add(l.qty));
    }
  
    // Update each PO line
    for (const pol of sm.purchaseOrder.lines) {
      const addQty = receivedMap.get(pol.itemId.toString());
      if (!addQty) continue;
  
      const newReceived = new Prisma.Decimal(pol.receivedQty).add(addQty);
  
      await tx.purchaseOrderLine.update({
        where: { id: pol.id },
        data: { receivedQty: newReceived },
      });
    }
  
    // Check if PO fully received
    const refreshedLines = await tx.purchaseOrderLine.findMany({
      where: { purchaseOrderId: sm.purchaseOrderId! },
    });
  
    const allDone = refreshedLines.every(
      (l) => new Prisma.Decimal(l.receivedQty).gte(l.qty)
    );
  
    if (allDone && sm.purchaseOrder.status !== "RECEIVED") {
      await tx.purchaseOrder.update({
        where: { id: sm.purchaseOrderId! },
        data: { status: "RECEIVED" },
      });
    }
  }
  private static async applyProductionOrderReceipt(
    tx: Prisma.TransactionClient,
    stockMoveId: bigint
  ) {
    const sm = await tx.stockMove.findUnique({
      where: { id: stockMoveId },
      include: {
        productionOrder: true,
        lines: true,
      },
    });
  
    if (!sm || !sm.productionOrder) return;
  
    if (sm.moveType !== "RECEIPT") {
      throw E.badRequest("Only RECEIPT stock move can receipt finished goods for production order");
    }
  
    // RECEIPT thành phẩm cho MO: line phải dùng productVariantId (khuyến nghị)
    for (const l of sm.lines) {
      if (!l.productVariantId) {
        if (l.itemId) {
          throw E.badRequest("RECEIPT for production order requires productVariantId (not itemId)");
        }
        throw E.badRequest("RECEIPT for production order requires productVariantId");
      }
    }
  
    // Lấy breakdowns hiện tại
    const bds = await tx.productionOrderBreakdown.findMany({
      where: { productionOrderId: sm.productionOrderId! },
    });
    const bdMap = new Map<string, typeof bds[number]>();
    for (const b of bds) bdMap.set(b.productVariantId.toString(), b);
  
    // Gom qty theo variant
    const receiptMap = new Map<string, Prisma.Decimal>();
    for (const l of sm.lines) {
      const key = l.productVariantId!.toString();
      const prev = receiptMap.get(key) ?? new Prisma.Decimal(0);
      receiptMap.set(key, prev.add(l.qty));
    }
  
    // Update breakdown qtyDone + validate không vượt qtyPlan breakdown (nếu bạn muốn chặn)
    let totalAdded = new Prisma.Decimal(0);
  
    for (const [variantIdStr, addQty] of receiptMap.entries()) {
      const bd = bdMap.get(variantIdStr);
      if (!bd) {
        throw E.badRequest(`Variant ${variantIdStr} is not in breakdowns of this MO`);
      }
  
      const newDone = new Prisma.Decimal(bd.qtyDone).add(addQty);
  
      if (newDone.gt(bd.qtyPlan)) {
        throw E.badRequest(
          `Receipt exceeds plan for variant ${variantIdStr} (plan=${bd.qtyPlan.toString()}, done=${newDone.toString()})`
        );
      }
  
      await tx.productionOrderBreakdown.update({
        where: { id: bd.id },
        data: { qtyDone: newDone },
      });
  
      totalAdded = totalAdded.add(addQty);
    }
  
    // Update MO qtyDone + validate không vượt qtyPlan
    const mo = sm.productionOrder;
    const moNewDone = new Prisma.Decimal(mo.qtyDone).add(totalAdded);
  
    if (moNewDone.gt(mo.qtyPlan)) {
      throw E.badRequest(
        `Receipt exceeds MO plan (plan=${mo.qtyPlan.toString()}, done=${moNewDone.toString()})`
      );
    }
  
    await tx.productionOrder.update({
      where: { id: sm.productionOrderId! },
      data: {
        qtyDone: moNewDone,
        ...(moNewDone.gte(mo.qtyPlan) ? { status: "DONE" } : {}),
      },
    });
    const moRow = await tx.productionOrder.findUnique({
      where: { id: sm.productionOrderId! },
      select: { salesOrderItemId: true },
    });
    
    if (moRow?.salesOrderItemId) {
      const soItem = await tx.salesOrderItem.findUnique({
        where: { id: moRow.salesOrderItemId },
        select: { salesOrderId: true },
      });
    
      if (soItem) {
        await SalesOrdersService.syncStatusByProduction(tx, soItem.salesOrderId);
      }
    }
  }
  
  
  static async create(userId: bigint | null, data: any) {
    const move = await prisma.stockMove.create({
      data: {
        moveNo: data.moveNo,
        moveType: data.moveType,
        warehouseId: data.warehouseId,
        note: data.note,
        createdById: userId,
        lines: { create: data.lines },
      },
      include: { lines: true },
    });

    return {
      ...move,
      id: move.id.toString(),
      warehouseId: move.warehouseId.toString(),
      createdById: move.createdById?.toString() ?? null,
      lines: move.lines.map(l => ({
        ...l,
        id: l.id.toString(),
        stockMoveId: l.stockMoveId.toString(),
        itemId: l.itemId?.toString() ?? null,
        productVariantId: l.productVariantId?.toString() ?? null,
        fromLocationId: l.fromLocationId?.toString() ?? null,
        toLocationId: l.toLocationId?.toString() ?? null,
      })),
    };
  }

  static async post(id: bigint) {
    return prisma.$transaction(async (tx) => {
      const sm = await tx.stockMove.findUnique({
        where: { id },
        select: { id: true, status: true },
      });
      if (!sm) throw E.notFound("Stock move not found");
      if (sm.status !== "DRAFT") throw E.badRequest("Only DRAFT stock move can be posted");
  
      await tx.stockMove.update({
        where: { id },
        data: { status: "POSTED" },
      });
  
      // ✅ Auto update PO receiving
      await this.applyPurchaseOrderReceipt(tx, id);
      await this.applyProductionOrderIssue(tx, id);     // ✅ thêm dòng này
      await this.applyProductionOrderReceipt(tx, id);
      await this.applySalesOrderOut(tx, id);
      return { ok: true };
    });
  }
  
  static async list(q: any) {
    const where: Prisma.StockMoveWhereInput = {};
    const AND: Prisma.StockMoveWhereInput[] = [];

    if (q.warehouseId) AND.push({ warehouseId: q.warehouseId });
    if (q.moveType) AND.push({ moveType: q.moveType });
    if (q.status) AND.push({ status: q.status });

    if (q.fromDate || q.toDate) {
      AND.push({
        moveDate: {
          ...(q.fromDate ? { gte: q.fromDate } : {}),
          ...(q.toDate ? { lte: q.toDate } : {}),
        },
      });
    }

    if (AND.length) where.AND = AND;

    const [total, rows] = await prisma.$transaction([
      prisma.stockMove.count({ where }),
      prisma.stockMove.findMany({
        where,
        orderBy: { moveDate: "desc" },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        include: {
          warehouse: true,
          createdBy: true,
          purchaseOrder: { select: { id: true, poNo: true } },
          productionOrder: { select: { id: true, moNo: true } },
          salesOrder: { select: { id: true, orderNo: true } },
        },
      }),
    ]);

    return {
      page: q.page,
      pageSize: q.pageSize,
      total,
      items: rows.map((m) => ({
        ...m,
        id: m.id.toString(),
        warehouseId: m.warehouseId.toString(),
        createdById: m.createdById?.toString(),
        purchaseOrderId: m.purchaseOrderId?.toString(),
        productionOrderId: m.productionOrderId?.toString(),
        salesOrderId: m.salesOrderId?.toString(),
      })),
    };
  }

  static async get(id: bigint) {
    const sm = await prisma.stockMove.findUnique({
      where: { id },
      include: {
        warehouse: true,
        createdBy: true,
        purchaseOrder: true,
        productionOrder: true,
        salesOrder: true,
        lines: {
          include: {
            item: true,
            productVariant: {
              include: {
                productStyle: true,
                size: true,
                color: true,
              },
            },
            fromLocation: true,
            toLocation: true,
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!sm) throw E.notFound("Stock move not found");

    return {
      ...sm,
      id: sm.id.toString(),
      warehouseId: sm.warehouseId.toString(),
      createdById: sm.createdById?.toString(),
      purchaseOrderId: sm.purchaseOrderId?.toString(),
      productionOrderId: sm.productionOrderId?.toString(),
      salesOrderId: sm.salesOrderId?.toString(),
      lines: sm.lines.map((l) => ({
        ...l,
        id: l.id.toString(),
        stockMoveId: l.stockMoveId.toString(),
        itemId: l.itemId?.toString(),
        productVariantId: l.productVariantId?.toString(),
        fromLocationId: l.fromLocationId?.toString(),
        toLocationId: l.toLocationId?.toString(),
      })),
    };
  }
  
}
