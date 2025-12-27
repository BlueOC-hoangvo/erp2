import { api, unwrap } from "@/lib/api";
import type { Warehouse } from "../types";

export async function getWarehouseById(id: string | number) {
  return unwrap<Warehouse>(api.get(`/warehouses/${id}`));
}