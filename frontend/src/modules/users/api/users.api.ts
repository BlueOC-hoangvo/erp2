import { api, unwrap } from "@/lib/api";

export type User = {
  id: number;
  email: string;
  fullName?: string;
  phone?: string;
  isActive: boolean;
  roleId?: number;
  role?: {
    id: number;
    name: string;
    code: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type UserCreate = {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
  roleId?: number;
};

export type UserUpdate = {
  email?: string;
  fullName?: string;
  phone?: string;
  isActive?: boolean;
  roleId?: number;
};

export type UserQuery = {
  q?: string;
  email?: string;
  fullName?: string;
  roleId?: number;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "updatedAt" | "email" | "fullName";
  sortOrder?: "asc" | "desc";
};

export async function getUsers(query: UserQuery = {}) {
  return unwrap<User[]>(api.get("/users", { params: query }));
}

export async function getUserById(id: number) {
  return unwrap<User>(api.get(`/users/${id}`));
}

export async function createUser(data: UserCreate) {
  return unwrap<User>(api.post("/users", data));
}

export async function updateUser(id: number, data: UserUpdate) {
  return unwrap<User>(api.put(`/users/${id}`, data));
}

export async function deleteUser(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/users/${id}`));
}

export async function resetUserPassword(id: number, password: string) {
  return unwrap<{ ok: boolean }>(api.post(`/users/${id}/reset-password`, { password }));
}
