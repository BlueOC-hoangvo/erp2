import { api, unwrap } from "@/lib/api";
import type { Customer } from "../types";

export type UpdateCustomerBody = Partial<{
  code: string;
  name: string;
  taxCode: string;
  phone: string;
  email: string;
  address: string;
  note: string;
}>;

export async function updateCustomer(id: string, body: UpdateCustomerBody) {
  const res = await unwrap<{ ok: true } | Customer>(api.put(`/customers/${id}`, body));
  return res.data;
}
