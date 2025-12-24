import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";

function toIdString<T extends { id: bigint }>(row: T) {
  return { ...row, id: row.id.toString() };
}

export class SizesService {
  static async list(input: any) {
    const where: Prisma.SizeWhereInput = {};
    const AND: Prisma.SizeWhereInput[] = [];
    if (input.q) AND.push({ OR: [{ code: { contains: input.q } }, { name: { contains: input.q } }] });
    if (typeof input.isActive === "boolean") AND.push({ isActive: input.isActive });
    if (AND.length) where.AND = AND;

    const [total, rows] = await prisma.$transaction([
      prisma.size.count({ where }),
      prisma.size.findMany({
        where,
        orderBy: { [input.sortBy]: input.sortOrder },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
    ]);
    return { page: input.page, pageSize: input.pageSize, total, items: rows.map(toIdString) };
  }

  static async get(id: bigint) {
    const row = await prisma.size.findUnique({ where: { id } });
    if (!row) throw E.notFound("Size not found");
    return toIdString(row);
  }

  static async create(data: any) {
    try {
      const row = await prisma.size.create({ data });
      return toIdString(row);
    } catch (e: any) {
      throw E.badRequest("Create size failed", e?.message);
    }
  }

  static async update(id: bigint, data: any) {
    await this.get(id);
    try {
      const row = await prisma.size.update({ where: { id }, data });
      return toIdString(row);
    } catch (e: any) {
      throw E.badRequest("Update size failed", e?.message);
    }
  }

  static async remove(id: bigint) {
    await this.get(id);
    try {
      await prisma.size.delete({ where: { id } });
      return { ok: true };
    } catch (e: any) {
      throw E.badRequest("Cannot delete size (has related data?)", e?.message);
    }
  }
}
