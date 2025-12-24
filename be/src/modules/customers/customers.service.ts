import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import { writeAuditLog } from "../../common/audit";
import { recordStatusChange } from "../../common/status";

export class CustomersService {
  static async list(query: { page?: any; limit?: any; q?: any }) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const q = (query.q?.toString() || "").trim();

    const where: any = { deletedAt: null };
    if (q) where.OR = [{ name: { contains: q } }, { code: { contains: q } }];

    const [total, items] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: items.map((x) => ({ ...x, id: x.id.toString() })),
      meta: { page, limit, total },
    };
  }

  static async create(input: any, actorUserId: bigint) {
    const created = await prisma.customer.create({
      data: {
        code: input.code,
        name: input.name,
        phone: input.phone ?? null,
        email: input.email ?? null,
        address: input.address ?? null,
        status: input.status ?? "active",
      },
    });

    await writeAuditLog({
      actorUserId,
      action: "customer.create",
      entityType: "customer",
      entityId: created.id,
      after: created,
    });

    await recordStatusChange({
      entityType: "customer",
      entityId: created.id,
      fromStatus: null,
      toStatus: created.status,
      note: "Initial status",
      changedById: actorUserId,
    });

    return { ...created, id: created.id.toString() };
  }

  static async detail(id: bigint) {
    const c = await prisma.customer.findFirst({
      where: { id, deletedAt: null },
    });
    if (!c) throw E.notFound("Customer not found");
    return { ...c, id: c.id.toString() };
  }

  static async update(id: bigint, input: any, actorUserId: bigint) {
    const before = await prisma.customer.findFirst({
      where: { id, deletedAt: null },
    });
    if (!before) throw E.notFound("Customer not found");

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        ...(input.code ? { code: input.code } : {}),
        ...(input.name ? { name: input.name } : {}),
        ...(input.phone !== undefined ? { phone: input.phone ?? null } : {}),
        ...(input.email !== undefined ? { email: input.email ?? null } : {}),
        ...(input.address !== undefined
          ? { address: input.address ?? null }
          : {}),
        ...(input.status ? { status: input.status } : {}),
      },
    });

    await writeAuditLog({
      actorUserId,
      action: "customer.update",
      entityType: "customer",
      entityId: id,
      before,
      after: updated,
    });

    if (input.status && input.status !== before.status) {
      await recordStatusChange({
        entityType: "customer",
        entityId: id,
        fromStatus: before.status,
        toStatus: updated.status,
        note: "Customer status changed",
        changedById: actorUserId,
      });
    }

    return { ...updated, id: updated.id.toString() };
  }

  static async remove(id: bigint, actorUserId: bigint) {
    const before = await prisma.customer.findFirst({
      where: { id, deletedAt: null },
    });
    if (!before) throw E.notFound("Customer not found");

    const deleted = await prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await writeAuditLog({
      actorUserId,
      action: "customer.delete",
      entityType: "customer",
      entityId: id,
      before,
      after: deleted,
    });

    return { ok: true };
  }
}
