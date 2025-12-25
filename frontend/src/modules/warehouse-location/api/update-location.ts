import { api, unwrap } from "@/lib/api";
import type { Location, LocationUpsertBody } from "../types";

export async function updateLocation(
  id: string | number,
  body: LocationUpsertBody
) {
  return unwrap<Location>(api.put(`/locations/${id}`, body));
}
