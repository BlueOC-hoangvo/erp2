import { z } from "zod";

export const ListQueryDTO = z.object({
  page: z
    .preprocess(
      (v) => (v === undefined ? 1 : Number(v)),
      z.number().int().min(1)
    )
    .optional(),
  limit: z
    .preprocess(
      (v) => (v === undefined ? 20 : Number(v)),
      z.number().int().min(1).max(100)
    )
    .optional(),
  q: z.string().optional(),
});

export type ListQueryInput = z.infer<typeof ListQueryDTO>;
