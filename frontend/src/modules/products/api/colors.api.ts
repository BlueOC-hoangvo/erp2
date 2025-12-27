import { api, unwrap } from "@/lib/api";

export type Color = {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ColorCreate = {
  code: string;
  name: string;
  isActive?: boolean;
};

export type ColorUpdate = Partial<ColorCreate>;

export type ColorQuery = {
  q?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "updatedAt" | "name" | "code";
  sortOrder?: "asc" | "desc";
};

export async function getColors(query: ColorQuery = {}) {
  return unwrap<{ data: { items: Color[]; page: number; pageSize: number; total: number }; meta: any | null }>(api.get("/colors", { params: query }));
}

export async function getColorById(id: number) {
  return unwrap<Color>(api.get(`/colors/${id}`));
}

export async function createColor(data: ColorCreate) {
  return unwrap<Color>(api.post("/colors", data));
}

export async function updateColor(id: number, data: ColorUpdate) {
  return unwrap<Color>(api.put(`/colors/${id}`, data));
}

export async function deleteColor(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/colors/${id}`));
}
