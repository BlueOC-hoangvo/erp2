import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { BomsController } from "./boms.controller";
import { bomCreateDto, bomUpdateDto, bomQueryDto, zIdParam } from "./boms.dto";

const r = Router();

r.get("/", validate(bomQueryDto, "query"), BomsController.list);
r.get("/:id", validate(zIdParam, "params"), BomsController.get);

r.post("/", auth, validate(bomCreateDto, "body"), BomsController.create);
r.put("/:id", auth, validate(zIdParam, "params"), validate(bomUpdateDto, "body"), BomsController.update);
r.delete("/:id", auth, validate(zIdParam, "params"), BomsController.remove);

export default r;
