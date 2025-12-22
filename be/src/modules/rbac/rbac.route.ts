import { Router } from "express";
import { auth } from "../../middleware/auth";
import { permit } from "../../middleware/permit";
import { validate } from "../../middleware/validate";
import { RbacController } from "./rbac.controller";
import {
  CreateRoleDTO,
  UpdateRoleDTO,
  AssignPermissionsDTO,
  AssignRolesDTO,
} from "./rbac.dto";
import { zIdParam } from "../../common/zod";

export function rbacRoutes() {
  const r = Router();

  r.get(
    "/permissions",
    auth,
    permit("admin.permission.read"),
    RbacController.listPermissions
  );

  r.get("/roles", auth, permit("admin.role.read"), RbacController.listRoles);
  r.post(
    "/roles",
    auth,
    permit("admin.role.create"),
    validate(CreateRoleDTO),
    RbacController.createRole
  );

  // ✅ validate params.id -> bigint
  r.put(
    "/roles/:id",
    auth,
    permit("admin.role.update"),
    validate(zIdParam, "params"),
    validate(UpdateRoleDTO),
    RbacController.updateRole
  );

  r.delete(
    "/roles/:id",
    auth,
    permit("admin.role.delete"),
    validate(zIdParam, "params"),
    RbacController.deleteRole
  );

  r.post(
    "/roles/:id/permissions",
    auth,
    permit("admin.rbac.assign"),
    validate(zIdParam, "params"),
    validate(AssignPermissionsDTO),
    RbacController.assignRolePermissions
  );

  r.get("/users", auth, permit("admin.user.read"), RbacController.listUsers);

  r.post(
    "/users/:id/roles",
    auth,
    permit("admin.rbac.assign"),
    validate(zIdParam, "params"),
    validate(AssignRolesDTO),
    RbacController.assignUserRoles
  );

  return r;
}
