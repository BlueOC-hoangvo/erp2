import { api, unwrap } from "@/lib/api";
import type { Location } from "../types";

export async function getLocationById(id: string | number) {
  return unwrap<Location>(api.get(`/locations/${id}`));
}