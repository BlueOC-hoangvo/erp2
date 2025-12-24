import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import { Prisma } from "@prisma/client";

export class InventoryService {
  static async onhand(q: any) {
    // resolve scope locations
    let locationIds: bigint[] | undefined;
  
    if (q.locationId) {
      locationIds = [q.locationId];
    } else if (q.warehouseId) {
      const locs = await prisma.location.findMany({
        where: { warehouseId: q.warehouseId },
        select: { id: true },
      });
      locationIds = locs.map((x) => x.id);
    }
  
    // WHERE base: chỉ tính POSTED
    const whereMove: Prisma.StockMoveWhereInput = {
      status: "POSTED",
      ...(q.warehouseId ? { warehouseId: q.warehouseId } : {}),
    };
  
    // Helper tạo where cho lines theo scope location
    const whereScope =
      locationIds
        ? {
            OR: [
              { fromLocationId: { in: locationIds } },
              { toLocationId: { in: locationIds } },
            ],
          }
        : {};
  
    // ========= ITEMS =========
    // Lấy tất cả dòng item (itemId != null) thuộc scope
    // rồi tính tồn theo location theo rule:
    //   inbound (toLocation) +qty
    //   outbound (fromLocation) -qty
    const itemLines = await prisma.stockMoveLine.findMany({
      where: {
        stockMove: whereMove,
        itemId: { not: null },
        ...whereScope,
        ...(q.itemId ? { itemId: q.itemId } : {}),
      },
      select: {
        qty: true,
        uom: true,
        itemId: true,
        fromLocationId: true,
        toLocationId: true,
        item: { select: { id: true, sku: true, name: true, itemType: true, baseUom: true } },
        fromLocation: { select: { id: true, code: true, name: true, warehouseId: true } },
        toLocation: { select: { id: true, code: true, name: true, warehouseId: true } },
      },
      orderBy: { id: "asc" },
    });
  
    // group key: `${locationId}|ITEM|${itemId}`
    const itemMap = new Map<string, any>();
  
    for (const l of itemLines) {
      const qtyNum = Number(l.qty);
  
      // inbound toLocation
      if (l.toLocationId && (!locationIds || locationIds.includes(l.toLocationId))) {
        const key = `${l.toLocationId.toString()}|ITEM|${l.itemId!.toString()}`;
        const cur = itemMap.get(key) ?? {
          locationId: l.toLocationId.toString(),
          location: l.toLocation ? { ...l.toLocation, id: l.toLocation.id.toString(), warehouseId: l.toLocation.warehouseId.toString() } : null,
          itemId: l.itemId!.toString(),
          item: { ...l.item!, id: l.item!.id.toString() },
          uom: l.uom,
          qty: 0,
        };
        cur.qty += qtyNum;
        itemMap.set(key, cur);
      }
  
      // outbound fromLocation
      if (l.fromLocationId && (!locationIds || locationIds.includes(l.fromLocationId))) {
        const key = `${l.fromLocationId.toString()}|ITEM|${l.itemId!.toString()}`;
        const cur = itemMap.get(key) ?? {
          locationId: l.fromLocationId.toString(),
          location: l.fromLocation ? { ...l.fromLocation, id: l.fromLocation.id.toString(), warehouseId: l.fromLocation.warehouseId.toString() } : null,
          itemId: l.itemId!.toString(),
          item: { ...l.item!, id: l.item!.id.toString() },
          uom: l.uom,
          qty: 0,
        };
        cur.qty -= qtyNum;
        itemMap.set(key, cur);
      }
    }
  
    let items = Array.from(itemMap.values());
  
    // filter itemType / q (search)
    if (q.itemType) items = items.filter((x) => x.item?.itemType === q.itemType);
    if (q.q) {
      const s = q.q.toLowerCase();
      items = items.filter((x) =>
        (x.item?.name ?? "").toLowerCase().includes(s) ||
        (x.item?.sku ?? "").toLowerCase().includes(s)
      );
    }
  
    // ========= VARIANTS =========
    const variantLines = await prisma.stockMoveLine.findMany({
      where: {
        stockMove: whereMove,
        productVariantId: { not: null },
        ...whereScope,
        ...(q.productVariantId ? { productVariantId: q.productVariantId } : {}),
      },
      select: {
        qty: true,
        uom: true,
        productVariantId: true,
        fromLocationId: true,
        toLocationId: true,
        productVariant: {
          select: {
            id: true,
            sku: true,
            productStyleId: true,
            sizeId: true,
            colorId: true,
            productStyle: { select: { id: true, code: true, name: true } },
            size: { select: { id: true, code: true, name: true } },
            color: { select: { id: true, code: true, name: true } },
          },
        },
        fromLocation: { select: { id: true, code: true, name: true, warehouseId: true } },
        toLocation: { select: { id: true, code: true, name: true, warehouseId: true } },
      },
      orderBy: { id: "asc" },
    });
  
    const variantMap = new Map<string, any>();
  
    for (const l of variantLines) {
      const qtyNum = Number(l.qty);
  
      if (l.toLocationId && (!locationIds || locationIds.includes(l.toLocationId))) {
        const key = `${l.toLocationId.toString()}|VAR|${l.productVariantId!.toString()}`;
        const cur = variantMap.get(key) ?? {
          locationId: l.toLocationId.toString(),
          location: l.toLocation ? { ...l.toLocation, id: l.toLocation.id.toString(), warehouseId: l.toLocation.warehouseId.toString() } : null,
          productVariantId: l.productVariantId!.toString(),
          productVariant: l.productVariant
            ? {
                ...l.productVariant,
                id: l.productVariant.id.toString(),
                productStyleId: l.productVariant.productStyleId.toString(),
                sizeId: l.productVariant.sizeId.toString(),
                colorId: l.productVariant.colorId.toString(),
                productStyle: { ...l.productVariant.productStyle, id: l.productVariant.productStyle.id.toString() },
                size: { ...l.productVariant.size, id: l.productVariant.size.id.toString() },
                color: { ...l.productVariant.color, id: l.productVariant.color.id.toString() },
              }
            : null,
          uom: l.uom,
          qty: 0,
        };
        cur.qty += qtyNum;
        variantMap.set(key, cur);
      }
  
      if (l.fromLocationId && (!locationIds || locationIds.includes(l.fromLocationId))) {
        const key = `${l.fromLocationId.toString()}|VAR|${l.productVariantId!.toString()}`;
        const cur = variantMap.get(key) ?? {
          locationId: l.fromLocationId.toString(),
          location: l.fromLocation ? { ...l.fromLocation, id: l.fromLocation.id.toString(), warehouseId: l.fromLocation.warehouseId.toString() } : null,
          productVariantId: l.productVariantId!.toString(),
          productVariant: l.productVariant
            ? {
                ...l.productVariant,
                id: l.productVariant.id.toString(),
                productStyleId: l.productVariant.productStyleId.toString(),
                sizeId: l.productVariant.sizeId.toString(),
                colorId: l.productVariant.colorId.toString(),
                productStyle: { ...l.productVariant.productStyle, id: l.productVariant.productStyle.id.toString() },
                size: { ...l.productVariant.size, id: l.productVariant.size.id.toString() },
                color: { ...l.productVariant.color, id: l.productVariant.color.id.toString() },
              }
            : null,
          uom: l.uom,
          qty: 0,
        };
        cur.qty -= qtyNum;
        variantMap.set(key, cur);
      }
    }
  
    let variants = Array.from(variantMap.values());
  
    if (q.q) {
      const s = q.q.toLowerCase();
      variants = variants.filter((x) =>
        (x.productVariant?.sku ?? "").toLowerCase().includes(s) ||
        (x.productVariant?.productStyle?.name ?? "").toLowerCase().includes(s) ||
        (x.productVariant?.productStyle?.code ?? "").toLowerCase().includes(s)
      );
    }
  
    // paginate sau khi filter (đơn giản). Nếu dữ liệu lớn sẽ tối ưu sau.
    const paged = (arr: any[]) => {
      const total = arr.length;
      const start = (q.page - 1) * q.pageSize;
      return { total, items: arr.slice(start, start + q.pageSize) };
    };
  
    const itemPaged = paged(items);
    const variantPaged = paged(variants);
  
    return {
      page: q.page,
      pageSize: q.pageSize,
      // trả riêng total cho mỗi nhóm
      items: itemPaged.items,
      itemsTotal: itemPaged.total,
      variants: variantPaged.items,
      variantsTotal: variantPaged.total,
    };
  }
  
  static async ledger(q: any) {
    // Scope locationIds: nếu có locationId => chỉ location đó
    // nếu có warehouseId => tất cả location thuộc warehouse
    let locationIds: bigint[] | undefined;

    if (q.locationId) {
      locationIds = [q.locationId];
    } else if (q.warehouseId) {
      const locs = await prisma.location.findMany({
        where: { warehouseId: q.warehouseId },
        select: { id: true },
      });
      locationIds = locs.map((x) => x.id);
    }

    const whereMove: Prisma.StockMoveWhereInput = {
      status: "POSTED",
      ...(q.warehouseId ? { warehouseId: q.warehouseId } : {}),
      ...(q.moveType ? { moveType: q.moveType } : {}),
      ...(q.fromDate || q.toDate
        ? {
            moveDate: {
              ...(q.fromDate ? { gte: q.fromDate } : {}),
              ...(q.toDate ? { lte: q.toDate } : {}),
            },
          }
        : {}),
    };

    const whereLine: Prisma.StockMoveLineWhereInput = {
      ...(q.itemId ? { itemId: q.itemId } : {}),
      ...(q.productVariantId ? { productVariantId: q.productVariantId } : {}),
      ...(locationIds
        ? {
            OR: [
              { fromLocationId: { in: locationIds } },
              { toLocationId: { in: locationIds } },
            ],
          }
        : {}),
      stockMove: whereMove,
    };

    const [total, rows] = await prisma.$transaction([
      prisma.stockMoveLine.count({ where: whereLine }),
      prisma.stockMoveLine.findMany({
        where: whereLine,
        orderBy: [{ stockMove: { moveDate: "desc" } }, { id: "desc" }],
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        include: {
          stockMove: {
            include: {
              warehouse: true,
              createdBy: true,
            },
          },
          item: true,
          productVariant: {
            include: { productStyle: true, size: true, color: true },
          },
          fromLocation: true,
          toLocation: true,
        },
      }),
    ]);

    // Tính signedQty theo scope:
    // - Nếu có locationIds: vào scope là +qty, ra scope là -qty
    // - Nếu không scope locationIds: + nếu toLocationId tồn tại, - nếu fromLocationId tồn tại
    const items = rows.map((l) => {
      const qtyNum = Number(l.qty);

      let signedQty = 0;
      if (locationIds) {
        const inQty = l.toLocationId && locationIds.includes(l.toLocationId) ? qtyNum : 0;
        const outQty = l.fromLocationId && locationIds.includes(l.fromLocationId) ? qtyNum : 0;
        signedQty = inQty - outQty;
      } else {
        signedQty = (l.toLocationId ? qtyNum : 0) - (l.fromLocationId ? qtyNum : 0);
      }

      return {
        lineId: l.id.toString(),
        stockMoveId: l.stockMoveId.toString(),

        moveNo: l.stockMove.moveNo,
        moveType: l.stockMove.moveType,
        moveDate: l.stockMove.moveDate,
        status: l.stockMove.status,

        warehouseId: l.stockMove.warehouseId.toString(),
        warehouse: { ...l.stockMove.warehouse, id: l.stockMove.warehouse.id.toString() },

        createdById: l.stockMove.createdById?.toString() ?? null,

        itemId: l.itemId?.toString() ?? null,
        productVariantId: l.productVariantId?.toString() ?? null,

        uom: l.uom,
        qty: l.qty,                // Prisma Decimal (serialize string)
        signedQty,                 // number cho FE dễ dùng (+/-)
        unitCost: l.unitCost,      // Decimal?
        note: l.note ?? null,

        fromLocationId: l.fromLocationId?.toString() ?? null,
        toLocationId: l.toLocationId?.toString() ?? null,
        fromLocation: l.fromLocation ? { ...l.fromLocation, id: l.fromLocation.id.toString(), warehouseId: l.fromLocation.warehouseId.toString(), parentId: l.fromLocation.parentId?.toString() ?? null } : null,
        toLocation: l.toLocation ? { ...l.toLocation, id: l.toLocation.id.toString(), warehouseId: l.toLocation.warehouseId.toString(), parentId: l.toLocation.parentId?.toString() ?? null } : null,

        item: l.item ? { ...l.item, id: l.item.id.toString() } : null,
        productVariant: l.productVariant
          ? {
              ...l.productVariant,
              id: l.productVariant.id.toString(),
              productStyleId: l.productVariant.productStyleId.toString(),
              sizeId: l.productVariant.sizeId.toString(),
              colorId: l.productVariant.colorId.toString(),
              productStyle: { ...l.productVariant.productStyle, id: l.productVariant.productStyle.id.toString() },
              size: { ...l.productVariant.size, id: l.productVariant.size.id.toString() },
              color: { ...l.productVariant.color, id: l.productVariant.color.id.toString() },
            }
          : null,
      };
    });

    return {
      page: q.page,
      pageSize: q.pageSize,
      total,
      items,
    };
  }
}
