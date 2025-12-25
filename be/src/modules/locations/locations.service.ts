import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";

const map = (l: any) => ({
  ...l,
  id: l.id.toString(),
  warehouseId: l.warehouseId.toString(),
  parentId: l.parentId ? l.parentId.toString() : null,
});

export class LocationsService {
  static async list(query: { warehouseId: bigint; parentId?: bigint }) {
    const rows = await prisma.location.findMany({
      where: {
        warehouseId: query.warehouseId,
        parentId: query.parentId ?? null,
      },
      orderBy: { code: "asc" },
    });
    return rows.map(map);
  }

  static async get(id: bigint) {
    const row = await prisma.location.findUnique({ where: { id } });
    if (!row) throw E.notFound("Location not found");
    return map(row);
  }

  static async create(data: {
    warehouseId: bigint;
    code: string;
    name: string;
    parentId?: bigint;
  }) {
    return map(await prisma.location.create({ data }));
  }

  static async remove(id: bigint) {
    const childCount = await prisma.location.count({ where: { parentId: id } });
    if (childCount > 0) {
      throw E.badRequest("Cannot delete location with children");
    }

    await prisma.location.delete({ where: { id } });
    return { ok: true };
  }
}
