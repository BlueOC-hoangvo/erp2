import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { ColorsController } from "./colors.controller";
import { colorCreateDto, colorQueryDto, colorUpdateDto, zIdParam } from "./colors.dto";

const r = Router();

r.get("/", validate(colorQueryDto, "query"), ColorsController.list);
r.get("/:id", validate(zIdParam, "params"), ColorsController.get);

r.post("/", auth, validate(colorCreateDto, "body"), ColorsController.create);
r.put("/:id", auth, validate(zIdParam, "params"), validate(colorUpdateDto, "body"), ColorsController.update);
r.delete("/:id", auth, validate(zIdParam, "params"), ColorsController.remove);

export default r;
