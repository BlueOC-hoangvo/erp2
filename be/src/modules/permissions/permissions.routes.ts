import { Router } from "express";
import { auth } from "../../middleware/auth";
import { permit } from "../../middleware/permit";
import { ok } from "../../common/response";

export function permissionsRoutes() {
  const r = Router();

  r.get("/", auth, permit("system.permission.read"), async (_req: any, res: any) => {
    // list all permissions
    // (nếu muốn phân trang/filter module thì nói mình thêm)
    const { prisma } = await import("../../db/prisma");
    const perms = await prisma.permission.findMany({ orderBy: [{ module: "asc" }, { code: "asc" }] });

    return ok(res, {
      data: perms.map((p) => ({
        ...p,
        id: p.id.toString(),
      })),
      meta: null,
    });
  });

  return r;
}
