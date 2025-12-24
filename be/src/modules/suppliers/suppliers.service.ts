import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import type { Prisma } from "@prisma/client";

function toIdString<T extends { id: bigint }>(row: T) {
  return { ...row, id: row.id.toString() };
}

export class SuppliersService {
  static async list(input: {
    q?: string;
    name?: string;
    phone?: string;
    email?: string;
    taxCode?: string;
    page: number;
    pageSize: number;
    sortBy: "createdAt" | "updatedAt" | "name";
    sortOrder: "asc" | "desc";
  }) {
    const { page, pageSize } = input;
    const where: Prisma.SupplierWhereInput = {};
    const AND: Prisma.SupplierWhereInput[] = [];

    if (input.q) {
      AND.push({
        OR: [
          { name: { contains: input.q } },
          { phone: { contains: input.q } },
          { email: { contains: input.q } },
          { taxCode: { contains: input.q } },
          { code: { contains: input.q } },
        ],
      });
    }
    if (input.name) AND.push({ name: { contains: input.name } });
    if (input.phone) AND.push({ phone: { contains: input.phone } });
    if (input.email) AND.push({ email: { contains: input.email } });
    if (input.taxCode) AND.push({ taxCode: { contains: input.taxCode } });
    if (AND.length) where.AND = AND;

    const [total, rows] = await prisma.$transaction([
      prisma.supplier.count({ where }),
      prisma.supplier.findMany({
        where,
        orderBy: { [input.sortBy]: input.sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return { page, pageSize, total, items: rows.map(toIdString) };
  }

  static async get(id: bigint) {
    const row = await prisma.supplier.findUnique({ where: { id } });
    if (!row) throw E.notFound("Supplier not found");
    return toIdString(row);
  }

  static async create(data: any) {
    try {
      const row = await prisma.supplier.create({ data });
      return toIdString(row);
    } catch (e: any) {
      throw E.badRequest("Create supplier failed", e?.message);
    }
  }

  static async update(id: bigint, data: any) {
    await this.get(id);
    try {
      const row = await prisma.supplier.update({ where: { id }, data });
      return toIdString(row);
    } catch (e: any) {
      throw E.badRequest("Update supplier failed", e?.message);
    }
  }

  static async remove(id: bigint) {
    await this.get(id);
    // purchaseOrders onDelete: Restrict => nếu có PO sẽ lỗi, trả message rõ hơn
    try {
      await prisma.supplier.delete({ where: { id } });
      return { ok: true };
    } catch (e: any) {
      throw E.badRequest("Cannot delete supplier (has related data?)", e?.message);
    }
  }
}
