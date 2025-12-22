import { Response, NextFunction } from "express";
import { AuthedRequest } from "./auth";
import { E } from "../common/errors";
import { prisma } from "../db/prisma";

export function permit(permissionCode: string) {
  return async (req: AuthedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) return next(E.unauthorized());
    const userId = req.user.id;

    const rows = await prisma.userRole.findMany({
      where: { userId },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    });

    const perms = new Set<string>();
    for (const ur of rows) {
      for (const rp of ur.role.permissions) perms.add(rp.permission.code);
    }

    if (!perms.has(permissionCode))
      return next(E.forbidden(`Missing permission: ${permissionCode}`));
    (req as any).perms = perms;
    next();
  };
}
