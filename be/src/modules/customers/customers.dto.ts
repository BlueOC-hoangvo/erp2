import { z } from "zod";

export const CreateCustomerDTO = z.object({
  code: z.string().min(2).max(50),
  name: z.string().min(2).max(255),
  phone: z.string().max(50).optional(),
  email: z.string().email().optional(),
  address: z.string().max(500).optional(),
  status: z.string().optional(), // "active"|"inactive"
});

export const UpdateCustomerDTO = CreateCustomerDTO.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "At least one field is required" }
);
