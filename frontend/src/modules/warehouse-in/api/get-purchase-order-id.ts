import { api, unwrap } from "@/lib/api";
import type { WarehouseIn } from "../types";

export async function getWarehouseInById(id: string | number) {
  return unwrap<WarehouseIn>(api.get(`/purchase-orders/${id}`));
}