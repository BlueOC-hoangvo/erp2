import { api, unwrap } from "@/lib/api";
import type { Customer } from "../types";

export async function getCustomerById(id: string) {
  const res = await unwrap<Customer>(api.get(`/customers/${id}`));
  return res.data;
}
