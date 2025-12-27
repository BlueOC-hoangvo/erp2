import { api, unwrap } from "@/lib/api";
import type { WarehouseIn } from "../types";

export type GetWarehouseInsQuery = { page?: number; limit?: number; q?: string };

export type PageResult<T> = {
  page: number;
  pageSize: number;
  total: number;
  items: T[];
};

export async function getWarehouseIns(query: GetWarehouseInsQuery) {
  return unwrap<PageResult<WarehouseIn>>(api.get("/purchase-orders", { params: query }));
}