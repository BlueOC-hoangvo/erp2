import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import { Prisma } from "@prisma/client";

const mapId = (x: any) => ({ ...x, id: x.id.toString() });

export class BomsService {
  static async list(q: any) {
    const where: Prisma.BomWhereInput = {};
    const AND: Prisma.BomWhereInput[] = [];

    if (q.q) AND.push({ OR: [{ code: { contains: q.q } }, { name: { contains: q.q } }] });
    if (q.productStyleId) AND.push({ productStyleId: q.productStyleId });
    if (q.isActive !== undefined) AND.push({ isActive: q.isActive });

    if (AND.length) where.AND = AND;

    const [total, rows] = await prisma.$transaction([
      prisma.bom.count({ where }),
      prisma.bom.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
        include: { productStyle: true },
      }),
    ]);

    return {
      page: q.page,
      pageSize: q.pageSize,
      total,
      items: rows.map((b) => ({
        ...b,
        id: b.id.toString(),
        productStyleId: b.productStyleId.toString(),
        productStyle: mapId(b.productStyle),
      })),
    };
  }

  static async get(id: bigint) {
    const bom = await prisma.bom.findUnique({
      where: { id },
      include: {
        productStyle: true,
        lines: { include: { item: true }, orderBy: { id: "asc" } },
      },
    });
    if (!bom) throw E.notFound("BOM not found");

    return {
      ...bom,
      id: bom.id.toString(),
      productStyleId: bom.productStyleId.toString(),
      productStyle: mapId(bom.productStyle),
      lines: bom.lines.map((l) => ({
        ...l,
        id: l.id.toString(),
        bomId: l.bomId.toString(),
        itemId: l.itemId.toString(),
        item: mapId(l.item),
      })),
    };
  }

  static async create(data: any) {
    return prisma.$transaction(async (tx) => {
      const bom = await tx.bom.create({
        data: {
          ...(data.code !== undefined ? { code: data.code } : {}),
          productStyleId: data.productStyleId,
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
          ...(data.lines !== undefined
            ? {
                lines: {
                  create: data.lines.map((l: any) => ({
                    itemId: l.itemId,
                    uom: l.uom ?? "pcs",
                    qtyPerUnit: new Prisma.Decimal(l.qtyPerUnit),
                    wastagePercent: new Prisma.Decimal(l.wastagePercent ?? 0),
                  })),
                },
              }
            : {}),
        },
      });

      return { id: bom.id.toString() };
    });
  }

  static async update(id: bigint, data: any) {
    await this.get(id);

    return prisma.$transaction(async (tx) => {
      await tx.bom.update({
        where: { id },
        data: {
          ...(data.code !== undefined ? { code: data.code } : {}),
          ...(data.productStyleId !== undefined ? { productStyleId: data.productStyleId } : {}),
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        },
      });

      // ✅ replace lines nếu được gửi (kể cả [])
      if (data.lines !== undefined) {
        await tx.bomLine.deleteMany({ where: { bomId: id } });

        if (data.lines.length) {
          await tx.bomLine.createMany({
            data: data.lines.map((l: any) => ({
              bomId: id,
              itemId: l.itemId,
              uom: l.uom ?? "pcs",
              qtyPerUnit: new Prisma.Decimal(l.qtyPerUnit),
              wastagePercent: new Prisma.Decimal(l.wastagePercent ?? 0),
            })),
          });
        }
      }

      return { ok: true };
    });
  }

  static async remove(id: bigint) {
    await this.get(id);
    await prisma.bom.delete({ where: { id } });
    return { ok: true };
  }
}
