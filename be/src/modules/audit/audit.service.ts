import { prisma } from "../../db/prisma";

export class AuditService {
  static async list(query: any) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);

    const where: any = {};
    if (query.entityType) where.entityType = query.entityType.toString();
    if (query.entityId) where.entityId = BigInt(query.entityId.toString());
    if (query.action) where.action = query.action.toString();

    const [total, items] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data: items.map((x) => ({
        ...x,
        id: x.id.toString(),
        actorUserId: x.actorUserId?.toString() ?? null,
        entityId: x.entityId?.toString() ?? null,
      })),
      meta: { page, limit, total },
    };
  }
}
