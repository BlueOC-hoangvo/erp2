import { prisma } from "../db/prisma";
//để truy vết mọi hành động quan trọng và thay đổi dữ liệu
export async function writeAuditLog(args: {
  actorUserId?: bigint | null;
  action: string;
  entityType?: string | null;
  entityId?: bigint | null;
  before?: any;
  after?: any;
  metadata?: any;
}) {
  await prisma.auditLog.create({
    data: {
      actorUserId: args.actorUserId ?? null,
      action: args.action,
      entityType: args.entityType ?? null,
      entityId: args.entityId ?? null,
      beforeJson: args.before ?? null,
      afterJson: args.after ?? null,
      metadataJson: args.metadata ?? null,
    },
  });
}
