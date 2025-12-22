import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import { recordStatusChange } from "../../common/status";
import { writeAuditLog } from "../../common/audit";

export class StatusService {
  static async change(
    input: {
      entityType: string;
      entityId: bigint;
      toStatus: string;
      note?: string;
    },
    actorUserId: bigint
  ) {
    if (input.entityType !== "customer")
      throw E.badRequest("Unsupported entityType in MVP (only customer)");

    const before = await prisma.customer.findFirst({
      where: { id: input.entityId, deletedAt: null },
    });
    if (!before) throw E.notFound("Customer not found");

    const updated = await prisma.customer.update({
      where: { id: input.entityId },
      data: { status: input.toStatus },
    });

    await recordStatusChange({
      entityType: input.entityType,
      entityId: input.entityId,
      fromStatus: before.status,
      toStatus: input.toStatus,
      note: input.note ?? null,
      changedById: actorUserId,
    });

    await writeAuditLog({
      actorUserId,
      action: "status.change",
      entityType: input.entityType,
      entityId: input.entityId,
      before: { status: before.status },
      after: { status: updated.status },
    });

    return { ok: true };
  }

  static async history(query: { entityType: string; entityId: bigint }) {
    const items = await prisma.statusHistory.findMany({
      where: { entityType: query.entityType, entityId: query.entityId },
      orderBy: { createdAt: "desc" },
    });

    return items.map((x) => ({
      ...x,
      id: x.id.toString(),
      entityId: x.entityId.toString(),
      changedById: x.changedById.toString(),
    }));
  }
}
