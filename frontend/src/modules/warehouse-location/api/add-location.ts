import { api, unwrap } from "@/lib/api";
import type { Location, LocationUpsertBody } from "../types";

export async function addLocations(body: LocationUpsertBody) {
  return unwrap<Location>(api.post("/locations", body));
}
