import { api, unwrap } from "@/lib/api";
import type { Item } from "../types";

export async function getItemById(id: string | number) {
  return unwrap<Item>(api.get(`/items/${id}`));
}