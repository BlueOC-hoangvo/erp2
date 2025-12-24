import { api, unwrap } from "@/lib/api";

export type ProductStyle = {
  id: number;
  name: string;
  code?: string;
  note?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductStyleCreate = {
  name: string;
  code?: string;
  isActive?: boolean;
};

export type ProductStyleUpdate = Partial<ProductStyleCreate>;

export type ProductStyleQuery = {
  q?: string;
  name?: string;
  code?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
};

export async function getProductStyles(query: ProductStyleQuery = {}) {
  return unwrap<{ data: { items: ProductStyle[]; page: number; pageSize: number; total: number }; meta: any | null }>(api.get("/product-styles", { params: query }));
}

export async function getProductStyleById(id: number) {
  return unwrap<ProductStyle>(api.get(`/product-styles/${id}`));
}

export async function createProductStyle(data: ProductStyleCreate) {
  return unwrap<ProductStyle>(api.post("/product-styles", data));
}

export async function updateProductStyle(id: number, data: ProductStyleUpdate) {
  return unwrap<ProductStyle>(api.put(`/product-styles/${id}`, data));
}

export async function deleteProductStyle(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/product-styles/${id}`));
}
