import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { ProductVariantsController } from "./productVariants.controller";
import {
  productVariantCreateDto,
  productVariantQueryDto,
  productVariantUpdateDto,
  zIdParam,
} from "./productVariants.dto";

const r = Router();

r.get("/", validate(productVariantQueryDto, "query"), ProductVariantsController.list);
r.get("/:id", validate(zIdParam, "params"), ProductVariantsController.get);

r.post("/", auth, validate(productVariantCreateDto, "body"), ProductVariantsController.create);
r.put("/:id", auth, validate(zIdParam, "params"), validate(productVariantUpdateDto, "body"), ProductVariantsController.update);
r.delete("/:id", auth, validate(zIdParam, "params"), ProductVariantsController.remove);

export default r;
