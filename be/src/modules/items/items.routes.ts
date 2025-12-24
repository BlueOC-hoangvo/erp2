import { Router } from "express";
import { validate } from "../../middleware/validate";
import { auth } from "../../middleware/auth";
import { ItemsController } from "./items.controller";
import { itemCreateDto, itemUpdateDto, itemQueryDto, zIdParam } from "./items.dto";

const r = Router();

r.get("/", validate(itemQueryDto, "query"), ItemsController.list);
r.get("/:id", validate(zIdParam, "params"), ItemsController.get);

r.post("/", auth, validate(itemCreateDto, "body"), ItemsController.create);
r.put("/:id", auth, validate(zIdParam, "params"), validate(itemUpdateDto, "body"), ItemsController.update);
r.delete("/:id", auth, validate(zIdParam, "params"), ItemsController.remove);

export default r;
