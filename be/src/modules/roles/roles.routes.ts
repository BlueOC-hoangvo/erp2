import { Router } from "express";
import { auth } from "../../middleware/auth";
import { permit } from "../../middleware/permit";
import { validate } from "../../middleware/validate";
import { zIdParam } from "../../common/zod";
import { RolesController } from "./roles.controller";
import { RolesListQueryDTO, CreateRoleDTO, UpdateRoleDTO, AssignRolePermissionsDTO } from "./roles.dto";

export function rolesRoutes() {
  const r = Router();

  r.get("/", auth, permit("system.role.read"), validate(RolesListQueryDTO, "query"), RolesController.list);
  r.post("/", auth, permit("system.role.create"), validate(CreateRoleDTO), RolesController.create);

  r.get("/:id", auth, permit("system.role.read"), validate(zIdParam, "params"), RolesController.detail);
  r.put("/:id", auth, permit("system.role.update"), validate(zIdParam, "params"), validate(UpdateRoleDTO), RolesController.update);
  r.delete("/:id", auth, permit("system.role.delete"), validate(zIdParam, "params"), RolesController.remove);

  // replace role permissions
  r.post(
    "/:id/permissions",
    auth,
    permit("system.rbac.assign"),
    validate(zIdParam, "params"),
    validate(AssignRolePermissionsDTO),
    RolesController.assignPermissions
  );

  return r;
}
