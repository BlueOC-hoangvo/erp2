import { api, unwrap } from "@/lib/api";

export async function deleteCustomer(id: string) {
  const res = await unwrap<{ ok: boolean }>(api.delete(`/customers/${id}`));
  return res.data;
}
