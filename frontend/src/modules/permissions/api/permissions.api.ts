import { api, unwrap } from "@/lib/api";

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

export type PermissionQuery = {
  q?: string;
  name?: string;
  code?: string;
  module?: string;
  action?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "updatedAt" | "name" | "code" | "module";
  sortOrder?: "asc" | "desc";
};

export async function getPermissions(query: PermissionQuery = {}) {
  return unwrap<Permission[]>(api.get("/permissions", { params: query }));
}

export async function getPermissionById(id: number) {
  return unwrap<Permission>(api.get(`/permissions/${id}`));
}
