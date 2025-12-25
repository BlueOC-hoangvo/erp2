import { Router } from "express";
import { z } from "zod";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { ProductionOrdersController } from "./productionOrders.controller";
import { moCreateDto, moQueryDto, moUpdateDto, zIdParam, zBigInt } from "./productionOrders.dto";
import { generateMaterialsQueryDto } from "./productionOrders.dto";

const r = Router();

r.get("/", validate(moQueryDto, "query"), ProductionOrdersController.list);
r.get("/:id", validate(zIdParam, "params"), ProductionOrdersController.get);

r.post("/", auth, validate(moCreateDto, "body"), ProductionOrdersController.create);
r.put("/:id", auth, validate(zIdParam, "params"), validate(moUpdateDto, "body"), ProductionOrdersController.update);
r.delete("/:id", auth, validate(zIdParam, "params"), ProductionOrdersController.remove);
r.post(
    "/:id/generate-materials-from-bom",
    auth,
    validate(zIdParam, "params"),
    validate(generateMaterialsQueryDto, "query"),
    ProductionOrdersController.generateMaterialsFromBom
  );
  r.post("/:id/release", auth, validate(zIdParam, "params"), ProductionOrdersController.release);
  r.post("/:id/start", auth, validate(zIdParam, "params"), ProductionOrdersController.start);
  r.post("/:id/done", auth, validate(zIdParam, "params"), ProductionOrdersController.done);
r.post("/:id/cancel", auth, validate(zIdParam, "params"), ProductionOrdersController.cancel);

// Tạo Production Orders từ Sales Order
r.post("/from-sales-order/:salesOrderId", auth, validate(z.object({ salesOrderId: zBigInt }), "params"), ProductionOrdersController.createFromSalesOrder);
  
export default r;
