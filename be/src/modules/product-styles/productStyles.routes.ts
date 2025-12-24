import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { ProductStylesController } from "./productStyles.controller";
import { productStyleCreateDto, productStyleQueryDto, productStyleUpdateDto, zIdParam } from "./productStyles.dto";

const r = Router();

r.get("/", validate(productStyleQueryDto, "query"), ProductStylesController.list);
r.get("/:id", validate(zIdParam, "params"), ProductStylesController.get);

r.post("/", auth, validate(productStyleCreateDto, "body"), ProductStylesController.create);
r.put("/:id", auth, validate(zIdParam, "params"), validate(productStyleUpdateDto, "body"), ProductStylesController.update);
r.delete("/:id", auth, validate(zIdParam, "params"), ProductStylesController.remove);

export default r;
