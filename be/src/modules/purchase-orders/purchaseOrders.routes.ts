import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { PurchaseOrdersController } from "./purchaseOrders.controller";
import { poCreateDto, poQueryDto, poUpdateDto, zIdParam } from "./purchaseOrders.dto";

const r = Router();

r.get("/", validate(poQueryDto, "query"), PurchaseOrdersController.list);
r.get("/:id", validate(zIdParam, "params"), PurchaseOrdersController.get);

r.post("/", auth, validate(poCreateDto, "body"), PurchaseOrdersController.create);
r.put("/:id", auth, validate(zIdParam, "params"), validate(poUpdateDto, "body"), PurchaseOrdersController.update);
r.delete("/:id", auth, validate(zIdParam, "params"), PurchaseOrdersController.remove);
r.post("/:id/confirm", auth, validate(zIdParam, "params"), PurchaseOrdersController.confirm);
r.post("/:id/receiving", auth, validate(zIdParam, "params"), PurchaseOrdersController.receiving);
r.post("/:id/received", auth, validate(zIdParam, "params"), PurchaseOrdersController.received);
r.post("/:id/cancel", auth, validate(zIdParam, "params"), PurchaseOrdersController.cancel);

export default r;
