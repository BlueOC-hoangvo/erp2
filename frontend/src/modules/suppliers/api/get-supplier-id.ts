import { api, unwrap } from "@/lib/api";
import type { Supplier } from "../types";

export async function getSupplierById(id: string | number) {
  return unwrap<Supplier>(api.get(`/suppliers/${id}`));
}