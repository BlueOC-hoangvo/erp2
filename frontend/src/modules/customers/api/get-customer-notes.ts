import { api, unwrap } from "@/lib/api";
import type { CustomerNote } from "../types";

export async function getCustomerNotes(customerId: string) {
  const res = await unwrap<CustomerNote[]>(api.get(`/customers/${customerId}/notes`));
  return res.data || [];
}
