import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { SizesController } from "./sizes.controller";
import { sizeCreateDto, sizeQueryDto, sizeUpdateDto, zIdParam } from "./sizes.dto";

const r = Router();

r.get("/", validate(sizeQueryDto, "query"), SizesController.list);
r.get("/:id", validate(zIdParam, "params"), SizesController.get);

r.post("/", auth, validate(sizeCreateDto, "body"), SizesController.create);
r.put("/:id", auth, validate(zIdParam, "params"), validate(sizeUpdateDto, "body"), SizesController.update);
r.delete("/:id", auth, validate(zIdParam, "params"), SizesController.remove);

export default r;
