import { z } from "zod";

export const RolesListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
});

export const CreateRoleDTO = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
});

export const UpdateRoleDTO = CreateRoleDTO.partial();

export const AssignRolePermissionsDTO = z.object({
  permissionIds: z.array(z.string().min(1)).default([]), // replace all
});
