import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import type { CreateProductInput, UpdateProductInput, ProductQuery } from "./products.dto";

export class ProductsService {
  async list(query: ProductQuery) {
    const { page, limit, q, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (q) {
      where.OR = [
        { sku: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    // Exclude deleted products
    where.deletedAt = null;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async getById(id: bigint) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product || product.deletedAt) {
      throw E.notFound("Sản phẩm không tồn tại");
    }

    return product;
  }

  async create(input: CreateProductInput) {
    // Check if SKU already exists
    const existing = await prisma.product.findUnique({
      where: { sku: input.sku },
    });

    if (existing && !existing.deletedAt) {
      throw E.conflict("SKU đã tồn tại");
    }

    const product = await prisma.product.create({
      data: {
        sku: input.sku,
        name: input.name,
        unit: input.unit ?? null,
        width: input.width ?? null,
        height: input.height ?? null,
        length: input.length ?? null,
        weight: input.weight ?? null,
        standardCost: input.standardCost ?? null,
        salePrice: input.salePrice ?? null,
        safetyStock: input.safetyStock ?? null,
        status: input.status || "active",
      },
    });

    return product;
  }

  async update(id: bigint, input: UpdateProductInput) {
    // Check if product exists
    await this.getById(id);

    // If SKU is being updated, check for conflicts
    if (input.sku) {
      const existing = await prisma.product.findUnique({
        where: { sku: input.sku },
      });

      if (existing && existing.id !== id && !existing.deletedAt) {
        throw E.conflict("SKU đã tồn tại");
      }
    }

    // Filter out undefined values to avoid Prisma errors
    const data: any = {};
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        data[key] = value;
      }
    }

    // If no data to update, throw error
    if (Object.keys(data).length === 0) {
      throw E.badRequest("Không có dữ liệu để cập nhật");
    }

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return product;
  }

  async delete(id: bigint) {
    // Check if product exists
    await this.getById(id);

    // Soft delete by setting deletedAt
    const product = await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return product;
  }
}

export const productsService = new ProductsService();
