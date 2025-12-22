import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { ChangeStatusDTO, StatusHistoryQueryDTO } from "./status.dto";
import { StatusController } from "./status.controller";

export function statusRoutes() {
  const r = Router();
  r.post("/change", auth, validate(ChangeStatusDTO), StatusController.change);
  r.get(
    "/history",
    auth,
    validate(StatusHistoryQueryDTO, "query"),
    StatusController.history
  );
  return r;
}
