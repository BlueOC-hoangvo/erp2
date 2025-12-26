import { api, unwrap } from "@/lib/api";
import type { Warehouse, WarehouseUpsertBody } from "../types";

export async function addWarehouses(body: WarehouseUpsertBody) {
  return unwrap<Warehouse>(api.post("/warehouses", body));
}
