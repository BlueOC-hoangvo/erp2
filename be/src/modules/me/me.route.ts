import { Router } from "express";
import { auth } from "../../middleware/auth";
import { MeController } from "./me.controller";

export function meRoutes() {
  const r = Router();
  r.get("/me", auth, MeController.me);
  r.get("/me/permissions", auth, MeController.permissions);
  r.get("/me/menu", auth, MeController.menu);
  return r;
}
