import { Router } from "express";
import { validate } from "../../middleware/validate";
import { auth } from "../../middleware/auth";
import { SuppliersController } from "./suppliers.controller";
import { supplierCreateDto, supplierUpdateDto, supplierQueryDto, zIdParam } from "./suppliers.dto";

const r = Router();

// read: có thể mở, write: bắt buộc auth (giống Customer)
r.get("/", validate(supplierQueryDto, "query"), SuppliersController.list);
r.get("/:id", validate(zIdParam, "params"), SuppliersController.get);

r.post("/", auth, validate(supplierCreateDto, "body"), SuppliersController.create);
r.put("/:id", auth, validate(zIdParam, "params"), validate(supplierUpdateDto, "body"), SuppliersController.update);
r.delete("/:id", auth, validate(zIdParam, "params"), SuppliersController.remove);

export default r;
