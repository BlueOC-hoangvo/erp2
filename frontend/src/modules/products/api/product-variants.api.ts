import { api, unwrap } from "@/lib/api";
import type { ProductStyle } from "./product-styles.api";
import type { Size } from "./sizes.api";
import type { Color } from "./colors.api";

export type ProductVariant = {
  id: number;
  sku?: string;
  productStyleId: number;
  sizeId: number;
  colorId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productStyle?: ProductStyle;
  size?: Size;
  color?: Color;
};

export type ProductVariantCreate = {
  sku?: string;
  productStyleId: number;
  sizeId: number;
  colorId: number;
  isActive?: boolean;
};

export type ProductVariantUpdate = Partial<ProductVariantCreate>;

export type ProductVariantQuery = {
  q?: string;
  productStyleId?: number;
  sizeId?: number;
  colorId?: number;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "updatedAt" | "sku";
  sortOrder?: "asc" | "desc";
};

export async function getProductVariants(query: ProductVariantQuery = {}) {
  return unwrap<{ data: { items: ProductVariant[]; page: number; pageSize: number; total: number }; meta: any | null }>(api.get("/product-variants", { params: query }));
}

export async function getProductVariantById(id: number) {
  return unwrap<ProductVariant>(api.get(`/product-variants/${id}`));
}

export async function createProductVariant(data: ProductVariantCreate) {
  return unwrap<ProductVariant>(api.post("/product-variants", data));
}

export async function updateProductVariant(id: number, data: ProductVariantUpdate) {
  return unwrap<ProductVariant>(api.put(`/product-variants/${id}`, data));
}

export async function deleteProductVariant(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/product-variants/${id}`));
}
