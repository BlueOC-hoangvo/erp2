import { api, unwrap } from "@/lib/api";
import type { Item } from "../types";

export type GetItemsQuery = { page?: number; limit?: number; q?: string };

export type PageResult<T> = {
  page: number;
  pageSize: number;
  total: number;
  items: T[];
};

export async function getItems(query: GetItemsQuery) {
  return unwrap<PageResult<Item>>(api.get("/items", { params: query }));
}