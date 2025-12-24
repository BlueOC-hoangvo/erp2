import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { SalesOrdersController } from "./salesOrders.controller";
import { soCreateDto, soQueryDto, soUpdateDto, zIdParam } from "./salesOrders.dto";

const r = Router();

r.get("/", validate(soQueryDto, "query"), SalesOrdersController.list);
r.get("/:id", validate(zIdParam, "params"), SalesOrdersController.get);

r.post("/", auth, validate(soCreateDto, "body"), SalesOrdersController.create);
r.put("/:id", auth, validate(zIdParam, "params"), validate(soUpdateDto, "body"), SalesOrdersController.update);
r.delete("/:id", auth, validate(zIdParam, "params"), SalesOrdersController.remove);

r.post("/:id/confirm", auth, validate(zIdParam, "params"), SalesOrdersController.confirm);
r.post("/:id/cancel", auth, validate(zIdParam, "params"), SalesOrdersController.cancel);

export default r;
