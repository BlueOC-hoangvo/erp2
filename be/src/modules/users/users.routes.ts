import { Router } from "express";
import { auth } from "../../middleware/auth";
import { permit } from "../../middleware/permit";
import { validate } from "../../middleware/validate";
import { zIdParam } from "../../common/zod";
import {
  CreateUserDTO,
  UpdateUserDTO,
  ResetPasswordDTO,
  UsersListQueryDTO,
} from "./users.dto";
import { UsersController } from "./users.controller";

export function usersRoutes() {
  const r = Router();

  r.get(
    "/",
    auth,
    permit("system.user.read"),
    validate(UsersListQueryDTO, "query"),
    UsersController.list
  );

  r.post(
    "/",
    auth,
    permit("system.user.create"),
    validate(CreateUserDTO),
    UsersController.create
  );

  r.put(
    "/:id",
    auth,
    permit("system.user.update"),
    validate(zIdParam, "params"),
    validate(UpdateUserDTO),
    UsersController.update
  );

  r.post(
    "/:id/reset-password",
    auth,
    permit("system.user.reset_password"),
    validate(zIdParam, "params"),
    validate(ResetPasswordDTO),
    UsersController.resetPassword
  );

  r.delete(
    "/:id",
    auth,
    permit("system.user.delete"),
    validate(zIdParam, "params"),
    UsersController.remove
  );

  return r;
}
