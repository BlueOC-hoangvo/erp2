import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import { writeAuditLog } from "../../common/audit";

export class FilesService {
  static async saveUploadedFile(input: {
    path: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    uploadedById: bigint;
    publicUrl?: string | null;
  }) {
    const created = await prisma.file.create({
      data: {
        storage: "local",
        path: input.path,
        url: input.publicUrl ?? null,
        originalName: input.originalName,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        uploadedById: input.uploadedById,
      },
    });

    await writeAuditLog({
      actorUserId: input.uploadedById,
      action: "files.upload",
      entityType: "file",
      entityId: created.id,
      after: created,
    });

    return { ...created, id: created.id.toString() };
  }

  static async attachFile(
    input: {
      entityType: string;
      entityId: bigint;
      fileId: bigint;
      tag?: string;
    },
    actorUserId: bigint
  ) {
    const file = await prisma.file.findUnique({ where: { id: input.fileId } });
    if (!file) throw E.notFound("File not found");

    const attached = await prisma.entityFile.create({
      data: {
        entityType: input.entityType,
        entityId: input.entityId,
        fileId: input.fileId,
        tag: input.tag ?? null,
        createdById: actorUserId,
      },
      include: { file: true },
    });

    await writeAuditLog({
      actorUserId,
      action: "files.attach",
      entityType: input.entityType,
      entityId: input.entityId,
      after: { fileId: input.fileId.toString(), tag: attached.tag },
    });

    return {
      ...attached,
      id: attached.id.toString(),
      entityId: attached.entityId.toString(),
      fileId: attached.fileId.toString(),
      file: { ...attached.file, id: attached.file.id.toString() },
    };
  }

  static async listByEntity(entityType: string, entityId: bigint) {
    const items = await prisma.entityFile.findMany({
      where: { entityType, entityId },
      include: { file: true },
      orderBy: { createdAt: "desc" },
    });

    return items.map((x) => ({
      ...x,
      id: x.id.toString(),
      entityId: x.entityId.toString(),
      fileId: x.fileId.toString(),
      file: { ...x.file, id: x.file.id.toString() },
    }));
  }
}
