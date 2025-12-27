import { api, unwrap } from "@/lib/api";
import type { Supplier } from "../types";

export type GetSuppliersQuery = { page?: number; limit?: number; q?: string };

export type PageResult<T> = {
  page: number;
  pageSize: number;
  total: number;
  items: T[];
};

export async function getSuppliers(query: GetSuppliersQuery) {
  return unwrap<PageResult<Supplier>>(api.get("/suppliers", { params: query }));
}