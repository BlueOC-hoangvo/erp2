import { api, unwrap } from "@/lib/api";
import type { Location } from "../types";

export type GetLocationsQuery = { page?: number; limit?: number; q?: string };

export async function getLocations(query: GetLocationsQuery) {
  return unwrap<Location[]>(api.get("/locations", { params: query }));
}