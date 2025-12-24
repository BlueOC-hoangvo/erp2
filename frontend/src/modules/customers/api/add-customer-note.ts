import { api, unwrap } from "@/lib/api";
import type { CustomerNote } from "../types";

export async function addCustomerNote(customerId: string, content: string) {
  const res = await unwrap<{ id: string } | CustomerNote>(
    api.post(`/customers/${customerId}/notes`, { content })
  );
  return res.data;
}
