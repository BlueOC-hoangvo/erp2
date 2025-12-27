import { api, unwrap } from "@/lib/api";

export type Size = {
  id: number;
  code: string;
  name?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SizeCreate = {
  code: string;
  name?: string;
  isActive?: boolean;
};

export type SizeUpdate = Partial<SizeCreate>;

export type SizeQuery = {
  q?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "updatedAt" | "name" | "code";
  sortOrder?: "asc" | "desc";
};

export async function getSizes(query: SizeQuery = {}) {
  return unwrap<{ data: { items: Size[]; page: number; pageSize: number; total: number }; meta: any | null }>(api.get("/sizes", { params: query }));
}

export async function getSizeById(id: number) {
  return unwrap<Size>(api.get(`/sizes/${id}`));
}

export async function createSize(data: SizeCreate) {
  return unwrap<Size>(api.post("/sizes", data));
}

export async function updateSize(id: number, data: SizeUpdate) {
  return unwrap<Size>(api.put(`/sizes/${id}`, data));
}

export async function deleteSize(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/sizes/${id}`));
}
