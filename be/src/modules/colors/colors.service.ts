import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";

function toIdString<T extends { id: bigint }>(row: T) {
  return { ...row, id: row.id.toString() };
}

export class ColorsService {
  static async list(input: any) {
    const where: Prisma.ColorWhereInput = {};
    const AND: Prisma.ColorWhereInput[] = [];
    if (input.q) AND.push({ OR: [{ code: { contains: input.q } }, { name: { contains: input.q } }] });
    if (typeof input.isActive === "boolean") AND.push({ isActive: input.isActive });
    if (AND.length) where.AND = AND;

    const [total, rows] = await prisma.$transaction([
      prisma.color.count({ where }),
      prisma.color.findMany({
        where,
        orderBy: { [input.sortBy]: input.sortOrder },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
    ]);
    return { page: input.page, pageSize: input.pageSize, total, items: rows.map(toIdString) };
  }

  static async get(id: bigint) {
    const row = await prisma.color.findUnique({ where: { id } });
    if (!row) throw E.notFound("Color not found");
    return toIdString(row);
  }

  static async create(data: any) {
    try {
      const row = await prisma.color.create({ data });
      return toIdString(row);
    } catch (e: any) {
      throw E.badRequest("Create color failed", e?.message);
    }
  }

  static async update(id: bigint, data: any) {
    await this.get(id);
    try {
      const row = await prisma.color.update({ where: { id }, data });
      return toIdString(row);
    } catch (e: any) {
      throw E.badRequest("Update color failed", e?.message);
    }
  }

  static async remove(id: bigint) {
    await this.get(id);
    try {
      await prisma.color.delete({ where: { id } });
      return { ok: true };
    } catch (e: any) {
      throw E.badRequest("Cannot delete color (has related data?)", e?.message);
    }
  }
}
