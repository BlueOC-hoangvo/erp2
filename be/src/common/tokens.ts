import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env";

export function signAccessToken(payload: object) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL_SECONDS,
  });
}

export function signRefreshToken(payload: object) {
  // keep refresh token as JWT too (easy), but store ONLY hash in DB
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as any;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as any;
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
