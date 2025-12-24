import { api, unwrap } from "@/lib/api";

export async function deleteCustomerNote(customerId: string, noteId: string) {
  const res = await unwrap<{ ok: boolean }>(
    api.delete(`/customers/${customerId}/notes/${noteId}`)
  );
  return res.data;
}
