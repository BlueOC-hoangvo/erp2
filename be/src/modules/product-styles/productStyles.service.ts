import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";

function toIdString<T extends { id: bigint }>(row: T) {
  return { ...row, id: row.id.toString() };
}

export class ProductStylesService {
  static async list(input: {
    q?: string;
    isActive?: boolean;
    page: number;
    pageSize: number;
    sortBy: "createdAt" | "updatedAt" | "name";
    sortOrder: "asc" | "desc";
  }) {
    const where: Prisma.ProductStyleWhereInput = {};
    const AND: Prisma.ProductStyleWhereInput[] = [];

    if (input.q) {
      AND.push({
        OR: [
          { name: { contains: input.q } },
          { code: { contains: input.q } },
          { note: { contains: input.q } },
        ],
      });
    }
    if (typeof input.isActive === "boolean") AND.push({ isActive: input.isActive });
    if (AND.length) where.AND = AND;

    const [total, rows] = await prisma.$transaction([
      prisma.productStyle.count({ where }),
      prisma.productStyle.findMany({
        where,
        orderBy: { [input.sortBy]: input.sortOrder },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
    ]);

    return { page: input.page, pageSize: input.pageSize, total, items: rows.map(toIdString) };
  }

  static async get(id: bigint) {
    const row = await prisma.productStyle.findUnique({ where: { id } });
    if (!row) throw E.notFound("Product style not found");
    return toIdString(row);
  }

  static async create(data: any) {
    try {
      const row = await prisma.productStyle.create({ data });
      return toIdString(row);
    } catch (e: any) {
      throw E.badRequest("Create product style failed", e?.message);
    }
  }

  static async update(id: bigint, data: any) {
    await this.get(id);
    try {
      const row = await prisma.productStyle.update({ where: { id }, data });
      return toIdString(row);
    } catch (e: any) {
      throw E.badRequest("Update product style failed", e?.message);
    }
  }

  static async remove(id: bigint) {
    await this.get(id);
    try {
      await prisma.productStyle.delete({ where: { id } });
      return { ok: true };
    } catch (e: any) {
      throw E.badRequest("Cannot delete product style (has related data?)", e?.message);
    }
  }
}
