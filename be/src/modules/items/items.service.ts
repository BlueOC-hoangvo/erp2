import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import type { Prisma } from "@prisma/client";

function toIdString<T extends { id: bigint }>(row: T) {
  return { ...row, id: row.id.toString() };
}

export class ItemsService {
  static async list(input: {
    q?: string;
    itemType?: "FABRIC" | "ACCESSORY" | "PACKING" | "OTHER";
    isActive?: boolean;
    page: number;
    pageSize: number;
    sortBy: "createdAt" | "updatedAt" | "name";
    sortOrder: "asc" | "desc";
  }) {
    const where: Prisma.ItemWhereInput = {};
    const AND: Prisma.ItemWhereInput[] = [];

    if (input.q) {
      AND.push({
        OR: [
          { name: { contains: input.q } },
          { sku: { contains: input.q } },
          { note: { contains: input.q } },
        ],
      });
    }
    if (input.itemType) AND.push({ itemType: input.itemType });
    if (typeof input.isActive === "boolean") AND.push({ isActive: input.isActive });
    if (AND.length) where.AND = AND;

    const [total, rows] = await prisma.$transaction([
      prisma.item.count({ where }),
      prisma.item.findMany({
        where,
        orderBy: { [input.sortBy]: input.sortOrder },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
    ]);

    return { page: input.page, pageSize: input.pageSize, total, items: rows.map(toIdString) };
  }

  static async get(id: bigint) {
    const row = await prisma.item.findUnique({ where: { id } });
    if (!row) throw E.notFound("Item not found");
    return toIdString(row);
  }

  static async create(data: any) {
    try {
      const row = await prisma.item.create({ data });
      return toIdString(row);
    } catch (e: any) {
      throw E.badRequest("Create item failed", e?.message);
    }
  }

  static async update(id: bigint, data: any) {
    await this.get(id);
    try {
      const row = await prisma.item.update({ where: { id }, data });
      return toIdString(row);
    } catch (e: any) {
      throw E.badRequest("Update item failed", e?.message);
    }
  }

  static async remove(id: bigint) {
    await this.get(id);
    try {
      await prisma.item.delete({ where: { id } });
      return { ok: true };
    } catch (e: any) {
      throw E.badRequest("Cannot delete item (has related data?)", e?.message);
    }
  }
}
