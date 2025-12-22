import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { LoginDTO, RefreshDTO } from "./auth.dto";

export function authRoutes() {
  const r = Router();
  r.post("/login", validate(LoginDTO), AuthController.login);
  r.post("/refresh", validate(RefreshDTO), AuthController.refresh);
  r.post("/logout", validate(RefreshDTO), AuthController.logout);
  return r;
}
