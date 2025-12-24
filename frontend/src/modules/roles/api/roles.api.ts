import { api, unwrap } from "@/lib/api";

export type Role = {
  id: number;
  name: string;
  code: string;
  description?: string;
  permissions?: Permission[];
  createdAt: string;
  updatedAt: string;
};

export type Permission = {
  id: number;
  name: string;
  code: string;
  description?: string;
  module: string;
  action: string;
  createdAt: string;
  updatedAt: string;
};

export type RoleCreate = {
  name: string;
  code: string;
  description?: string;
  permissionIds?: number[];
};

export type RoleUpdate = {
  name?: string;
  code?: string;
  description?: string;
  permissionIds?: number[];
};

export type RoleQuery = {
  q?: string;
  name?: string;
  code?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "updatedAt" | "name" | "code";
  sortOrder?: "asc" | "desc";
};

export async function getRoles(query: RoleQuery = {}) {
  return unwrap<Role[]>(api.get("/roles", { params: query }));
}

export async function getRoleById(id: number) {
  return unwrap<Role>(api.get(`/roles/${id}`));
}

export async function createRole(data: RoleCreate) {
  return unwrap<Role>(api.post("/roles", data));
}

export async function updateRole(id: number, data: RoleUpdate) {
  return unwrap<Role>(api.put(`/roles/${id}`, data));
}

export async function deleteRole(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/roles/${id}`));
}
