import { api, unwrap } from "@/lib/api";

export type Warehouse = {
  id: number;
  name: string;
  code?: string;
  locationId?: number;
  location?: {
    id: number;
    name: string;
    code: string;
  };
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WarehouseCreate = {
  name: string;
  code?: string;
  locationId?: number;
  description?: string;
  isActive?: boolean;
};

export type WarehouseUpdate = Partial<WarehouseCreate>;

export type WarehouseQuery = {
  q?: string;
  name?: string;
  code?: string;
  locationId?: number;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
};

export async function getWarehouses(query: WarehouseQuery = {}) {
  return unwrap<Warehouse[]>(api.get("/warehouses", { params: query }));
}

export async function getWarehouseById(id: number) {
  return unwrap<Warehouse>(api.get(`/warehouses/${id}`));
}

export async function createWarehouse(data: WarehouseCreate) {
  return unwrap<Warehouse>(api.post("/warehouses", data));
}

export async function updateWarehouse(id: number, data: WarehouseUpdate) {
  return unwrap<Warehouse>(api.put(`/warehouses/${id}`, data));
}

export async function deleteWarehouse(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/warehouses/${id}`));
}
