import { z } from "zod";

export const zBigInt = z.preprocess((val) => {
  // Skip preprocessing for arrays and complex objects - let zod handle validation
  if (typeof val === "bigint") return val;
  if (typeof val === "number" && Number.isFinite(val)) return BigInt(val);
  if (typeof val === "string" && val.trim() !== "") {
    // Only convert if it's a valid numeric string
    const num = Number(val);
    if (Number.isFinite(num)) return BigInt(num);
  }
  // Return as-is for arrays, objects, null, undefined, or non-numeric strings
  return val;
}, z.bigint());

export const zIdParam = z.object({
  id: zBigInt,
});
