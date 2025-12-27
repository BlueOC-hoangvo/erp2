import { api, unwrap } from "@/lib/api";

export type Location = {
  id: number;
  name: string;
  code?: string;
  description?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LocationCreate = {
  name: string;
  code?: string;
  description?: string;
  address?: string;
  isActive?: boolean;
};

export type LocationUpdate = Partial<LocationCreate>;

export type LocationQuery = {
  q?: string;
  name?: string;
  code?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
};

export async function getLocations(query: LocationQuery = {}) {
  return unwrap<Location[]>(api.get("/locations", { params: query }));
}

export async function getLocationById(id: number) {
  return unwrap<Location>(api.get(`/locations/${id}`));
}

export async function createLocation(data: LocationCreate) {
  return unwrap<Location>(api.post("/locations", data));
}

export async function updateLocation(id: number, data: LocationUpdate) {
  return unwrap<Location>(api.put(`/locations/${id}`, data));
}

export async function deleteLocation(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/locations/${id}`));
}
