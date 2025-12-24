import { z } from "zod";

export const CreateUserDTO = z.object({
  email: z.string().email(),
  fullName: z.string().min(1),
  password: z.string().min(6),
  roleIds: z.array(z.string()).min(1),
  isActive: z.boolean().optional(),
});

export const UpdateUserDTO = z.object({
  fullName: z.string().min(1).optional(),
  roleIds: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const ResetPasswordDTO = z.object({
  password: z.string().min(6),
});

export const UsersListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
  roleId: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});
