export const env = {
  PORT: Number(process.env.PORT || 4000),
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "dev_access",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "dev_refresh",
  ACCESS_TOKEN_TTL_SECONDS: Number(process.env.ACCESS_TOKEN_TTL_SECONDS || 900),
  REFRESH_TOKEN_TTL_DAYS: Number(process.env.REFRESH_TOKEN_TTL_DAYS || 14),
  UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
};
