import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import type { Prisma } from "@prisma/client";

function toIdString<T extends { id: bigint }>(row: T) {
  return { ...row, id: row.id.toString() };
}

export class ProductVariantsService {
  static async list(input: any) {
    const where: Prisma.ProductVariantWhereInput = {};
    const AND: Prisma.ProductVariantWhereInput[] = [];

    if (input.productStyleId) AND.push({ productStyleId: input.productStyleId });
    if (input.sizeId) AND.push({ sizeId: input.sizeId });
    if (input.colorId) AND.push({ colorId: input.colorId });
    if (typeof input.isActive === "boolean") AND.push({ isActive: input.isActive });
    if (AND.length) where.AND = AND;

    const [total, rows] = await prisma.$transaction([
      prisma.productVariant.count({ where }),
      prisma.productVariant.findMany({
        where,
        orderBy: { [input.sortBy]: input.sortOrder },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        include: {
          productStyle: true,
          size: true,
          color: true,
        },
      }),
    ]);

    return {
      page: input.page,
      pageSize: input.pageSize,
      total,
      items: rows.map((v) => ({
        ...v,
        id: v.id.toString(),
        productStyleId: v.productStyleId.toString(),
        sizeId: v.sizeId.toString(),
        colorId: v.colorId.toString(),
        productStyle: toIdString(v.productStyle),
        size: toIdString(v.size),
        color: toIdString(v.color),
      })),
    };
  }

  static async get(id: bigint) {
    const v = await prisma.productVariant.findUnique({
      where: { id },
      include: { productStyle: true, size: true, color: true },
    });
    if (!v) throw E.notFound("Product variant not found");

    return {
      ...v,
      id: v.id.toString(),
      productStyleId: v.productStyleId.toString(),
      sizeId: v.sizeId.toString(),
      colorId: v.colorId.toString(),
      productStyle: toIdString(v.productStyle),
      size: toIdString(v.size),
      color: toIdString(v.color),
    };
  }

  static async create(data: any) {
    // unique (productStyleId, sizeId, colorId) enforced by DB
    try {
      const v = await prisma.productVariant.create({
        data,
        include: { productStyle: true, size: true, color: true },
      });
      return {
        ...v,
        id: v.id.toString(),
        productStyleId: v.productStyleId.toString(),
        sizeId: v.sizeId.toString(),
        colorId: v.colorId.toString(),
        productStyle: toIdString(v.productStyle),
        size: toIdString(v.size),
        color: toIdString(v.color),
      };
    } catch (e: any) {
      throw E.badRequest("Create product variant failed", e?.message);
    }
  }

  static async update(id: bigint, data: any) {
    await this.get(id);
    try {
      const v = await prisma.productVariant.update({
        where: { id },
        data,
        include: { productStyle: true, size: true, color: true },
      });
      return {
        ...v,
        id: v.id.toString(),
        productStyleId: v.productStyleId.toString(),
        sizeId: v.sizeId.toString(),
        colorId: v.colorId.toString(),
        productStyle: toIdString(v.productStyle),
        size: toIdString(v.size),
        color: toIdString(v.color),
      };
    } catch (e: any) {
      throw E.badRequest("Update product variant failed", e?.message);
    }
  }

  static async remove(id: bigint) {
    await this.get(id);
    try {
      await prisma.productVariant.delete({ where: { id } });
      return { ok: true };
    } catch (e: any) {
      throw E.badRequest("Cannot delete product variant (has related data?)", e?.message);
    }
  }
}
