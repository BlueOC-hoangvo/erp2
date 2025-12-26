import { api, unwrap } from "@/lib/api";

export async function deleteLocation(id: number) {
  const res = await unwrap<{ ok: boolean }>(api.delete(`/locations/${id}`));
  return res.data;
}
