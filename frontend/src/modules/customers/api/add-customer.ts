import { api, unwrap } from "@/lib/api";
import type { Customer } from "../types";

export type CreateCustomerBody = {
  code?: string;
  name: string;
  taxCode?: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
};

export async function addCustomer(body: CreateCustomerBody) {
  const res = await unwrap<{ id: string } | Customer>(api.post("/customers", body));
  return res.data;
}
