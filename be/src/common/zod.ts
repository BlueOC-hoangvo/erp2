import { z } from "zod";

export const zBigInt = z.preprocess((val) => {
  // Skip preprocessing for arrays and complex objects - let zod handle validation
  if (typeof val === "bigint") return val;
  if (typeof val === "number" && Number.isFinite(val)) return BigInt(val);
  if (typeof val === "string" && val.trim() !== "") return BigInt(val);
  // Return as-is for arrays, objects, null, undefined - will fail validation if not convertible
  return val;
}, z.bigint());

export const zIdParam = z.object({
  id: zBigInt,
});
