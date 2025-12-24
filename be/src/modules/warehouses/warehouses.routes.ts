import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { WarehousesController } from "./warehouses.controller";
import { warehouseCreateDto, warehouseUpdateDto, warehouseQueryDto, zIdParam } from "./warehouses.dto";

const r = Router();

r.get("/", validate(warehouseQueryDto, "query"), WarehousesController.list);
r.get("/:id", validate(zIdParam, "params"), WarehousesController.get);

r.post("/", auth, validate(warehouseCreateDto), WarehousesController.create);
r.put("/:id", auth, validate(zIdParam, "params"), validate(warehouseUpdateDto), WarehousesController.update);
r.delete("/:id", auth, validate(zIdParam, "params"), WarehousesController.remove);

export default r;
