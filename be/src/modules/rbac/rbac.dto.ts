import { z } from "zod";

export const CreateRoleDTO = z.object({
  code: z.string().min(2).max(50),
  name: z.string().min(2).max(255),
  description: z.string().max(500).optional(),
});

export const UpdateRoleDTO = CreateRoleDTO.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "At least one field is required" }
);

export const AssignPermissionsDTO = z.object({
  permissionIds: z.array(z.union([z.string(), z.number(), z.bigint()])).min(1),
});

export const AssignRolesDTO = z.object({
  roleIds: z.array(z.union([z.string(), z.number(), z.bigint()])).min(1),
});
