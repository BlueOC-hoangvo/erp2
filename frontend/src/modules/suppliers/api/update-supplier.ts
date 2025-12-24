import { api, unwrap } from "@/lib/api";
import type { Supplier, SupplierUpsertBody } from "../types";

export async function updateSupplier(
  id: string | number,
  body: SupplierUpsertBody
) {
  return unwrap<Supplier>(api.put(`/suppliers/${id}`, body));
}
