import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";

const map = (w: any) => ({ ...w, id: w.id.toString() });

export class WarehousesService {
  static async list(q: any) {
    const where = q.q
      ? { OR: [{ code: { contains: q.q } }, { name: { contains: q.q } }] }
      : {};
    const [total, rows] = await prisma.$transaction([
      prisma.warehouse.count({ where }),
      prisma.warehouse.findMany({
        where,
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
    ]);
    return { page: q.page, pageSize: q.pageSize, total, items: rows.map(map) };
  }

  static async get(id: bigint) {
    const row = await prisma.warehouse.findUnique({ where: { id } });
    if (!row) throw E.notFound("Warehouse not found");
    return map(row);
  }

  static async create(data: any) {
    const row = await prisma.warehouse.create({ data });
    return map(row);
  }

  static async update(id: bigint, data: any) {
    await this.get(id);
    return map(await prisma.warehouse.update({ where: { id }, data }));
  }

  static async remove(id: bigint) {
    await this.get(id);
    await prisma.warehouse.delete({ where: { id } });
    return { ok: true };
  }
}
