import { api, unwrap } from "@/lib/api";

export type Supplier = {
  id: number;
  code?: string;
  name: string;
  taxCode?: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type SupplierCreate = {
  code?: string;
  name: string;
  taxCode?: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
};

export type SupplierUpdate = Partial<SupplierCreate>;

export type SupplierQuery = {
  q?: string;
  name?: string;
  phone?: string;
  email?: string;
  taxCode?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
};

export async function getSuppliers(query: SupplierQuery = {}) {
  return unwrap<Supplier[]>(api.get("/suppliers", { params: query }));
}

export async function getSupplierById(id: number) {
  return unwrap<Supplier>(api.get(`/suppliers/${id}`));
}

export async function createSupplier(data: SupplierCreate) {
  return unwrap<Supplier>(api.post("/suppliers", data));
}

export async function updateSupplier(id: number, data: SupplierUpdate) {
  return unwrap<Supplier>(api.put(`/suppliers/${id}`, data));
}

export async function deleteSupplier(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/suppliers/${id}`));
}
