import { z } from "zod";

export const zBigInt = z.preprocess((val) => {
  if (typeof val === "bigint") return val;
  if (typeof val === "number" && Number.isFinite(val)) return BigInt(val);
  if (typeof val === "string" && val.trim() !== "") return BigInt(val);
  return val;
}, z.bigint());

export const zIdParam = z.object({
  id: zBigInt,
});
