import { prisma } from "../db/prisma";

export async function recordStatusChange(args: {
  entityType: string;
  entityId: bigint;
  fromStatus?: string | null;
  toStatus: string;
  note?: string | null;
  changedById: bigint;
}) {
  await prisma.statusHistory.create({
    data: {
      entityType: args.entityType,
      entityId: args.entityId,
      fromStatus: args.fromStatus ?? null,
      toStatus: args.toStatus,
      note: args.note ?? null,
      changedById: args.changedById,
    },
  });
}
