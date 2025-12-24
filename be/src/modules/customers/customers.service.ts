import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import type { Prisma } from "@prisma/client";

function toIdString<T extends { id: bigint }>(row: T) {
  return { ...row, id: row.id.toString() };
}

export class CustomersService {
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

    const where: Prisma.CustomerWhereInput = {};
    const AND: Prisma.CustomerWhereInput[] = [];

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
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        orderBy: { [input.sortBy]: input.sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      page,
      pageSize,
      total,
      items: rows.map(toIdString),
    };
  }

  static async get(id: bigint) {
    const row = await prisma.customer.findUnique({ where: { id } });
    if (!row) throw E.notFound("Customer not found");
    return toIdString(row);
  }

  static async create(data: {
    code?: string;
    name: string;
    taxCode?: string;
    phone?: string;
    email?: string;
    address?: string;
    note?: string;
  }) {
    try {
      const row = await prisma.customer.create({ data });
      return toIdString(row);
    } catch (e: any) {
      // unique violation (code)
      throw E.badRequest("Create customer failed", e?.message);
    }
  }

  static async update(id: bigint, data: Partial<{
    code: string;
    name: string;
    taxCode: string;
    phone: string;
    email: string;
    address: string;
    note: string;
  }>) {
    await this.get(id); // ensures exists
    try {
      const row = await prisma.customer.update({ where: { id }, data });
      return toIdString(row);
    } catch (e: any) {
      throw E.badRequest("Update customer failed", e?.message);
    }
  }

  static async remove(id: bigint) {
    await this.get(id);
    // notes cascade by schema (customer_notes onDelete: Cascade)
    await prisma.customer.delete({ where: { id } });
    return { ok: true };
  }

  // ---------------- Notes ----------------

  static async listNotes(customerId: bigint) {
    // Ensure customer exists (better error)
    await this.get(customerId);

    const rows = await prisma.customerNote.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
      },
    });

    return rows.map((n) => ({
      ...n,
      id: n.id.toString(),
      customerId: n.customerId.toString(),
      userId: n.userId ? n.userId.toString() : null,
      user: n.user
        ? { ...n.user, id: n.user.id.toString() }
        : null,
    }));
  }

  static async createNote(customerId: bigint, userId: bigint | null, data: { content: string }) {
    await this.get(customerId);

    const row = await prisma.customerNote.create({
      data: {
        customerId,
        userId: userId ?? null,
        content: data.content,
      },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
      },
    });

    return {
      ...row,
      id: row.id.toString(),
      customerId: row.customerId.toString(),
      userId: row.userId ? row.userId.toString() : null,
      user: row.user ? { ...row.user, id: row.user.id.toString() } : null,
    };
  }

  static async removeNote(customerId: bigint, noteId: bigint) {
    await this.get(customerId);

    const note = await prisma.customerNote.findUnique({ where: { id: noteId } });
    if (!note || note.customerId !== customerId) {
      throw E.notFound("Customer note not found");
    }

    await prisma.customerNote.delete({ where: { id: noteId } });
    return { ok: true };
  }
}
