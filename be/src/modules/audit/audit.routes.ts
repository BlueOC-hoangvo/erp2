import { Router } from "express";
import { auth } from "../../middleware/auth";
import { permit } from "../../middleware/permit";
import { validate } from "../../middleware/validate";
import { AuditController } from "./audit.controller";
import { AuditQueryDTO } from "./audit.dto";

export function auditRoutes() {
  const r = Router();
  r.get(
    "/",
    auth,
    permit("audit.read"),
    validate(AuditQueryDTO, "query"),
    AuditController.list
  );
  return r;
}
