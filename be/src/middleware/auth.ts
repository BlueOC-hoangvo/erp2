import { Request, Response, NextFunction } from "express";
import { E } from "../common/errors";
import { verifyAccessToken } from "../common/tokens";

export type AuthedRequest = Request & { user?: { id: bigint; email: string } };

export function auth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return next(E.unauthorized());

  const token = h.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token) as any;
    if (!payload?.sub) return next(E.unauthorized("Invalid token"));

    req.user = { id: BigInt(payload.sub), email: payload.email };
    return next();
  } catch (err: any) {
    if (err?.name === "TokenExpiredError") {
      return next(E.unauthorized("Access token expired"));
    }
    return next(E.unauthorized("Invalid access token"));
  }
}
