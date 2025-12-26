import { api, unwrap } from "@/lib/api";
import type { Supplier, SupplierUpsertBody } from "../types";

export async function addSupplier(body: SupplierUpsertBody) {
  return unwrap<Supplier>(api.post("/suppliers", body));
}
