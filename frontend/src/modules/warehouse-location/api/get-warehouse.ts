import { api, unwrap } from "@/lib/api";
import type { Warehouse } from "../types";

export type GetWarehousesQuery = { page?: number; limit?: number; q?: string };

export type PageResult<T> = {
  page: number;
  pageSize: number;
  total: number;
  items: T[];
};

export async function getWarehouses(query: GetWarehousesQuery) {
  return unwrap<PageResult<Warehouse>>(api.get("/warehouses", { params: query }));
}