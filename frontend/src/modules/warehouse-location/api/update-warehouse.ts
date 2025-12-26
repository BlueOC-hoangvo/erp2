import { api, unwrap } from "@/lib/api";
import type { Warehouse, WarehouseUpsertBody } from "../types";

export async function updateWarehouse(
  id: string | number,
  body: WarehouseUpsertBody
) {
  return unwrap<Warehouse>(api.put(`/warehouses/${id}`, body));
}
