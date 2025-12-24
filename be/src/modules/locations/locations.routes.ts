import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { LocationsController } from "./locations.controller";
import { locationCreateDto, locationQueryDto, zIdParam } from "./locations.dto";

const r = Router();

r.get("/", validate(locationQueryDto, "query"), LocationsController.list);
r.post("/", auth, validate(locationCreateDto, "body"), LocationsController.create);
r.delete("/:id", auth, validate(zIdParam, "params"), LocationsController.remove);

export default r;
