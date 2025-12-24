import { Router } from "express";
import { auth } from "../../middleware/auth";
import { permit } from "../../middleware/permit";
import { validate } from "../../middleware/validate";
import { CustomersController } from "./customers.controller";
import { CreateCustomerDTO, UpdateCustomerDTO } from "./customers.dto";
import { zIdParam } from "../../common/zod";
import { ListQueryDTO } from "../../common/query.dto";

export function customersRoutes() {
  const r = Router();

  r.get(
    "/",
    auth,
    permit("sales.customer.read"),
    validate(ListQueryDTO, "query"),
    CustomersController.list
  );

  r.post(
    "/",
    auth,
    permit("sales.customer.create"),
    validate(CreateCustomerDTO),
    CustomersController.create
  );

  // ✅ validate params.id => bigint
  r.get(
    "/:id",
    auth,
    permit("sales.customer.read"),
    validate(zIdParam, "params"),
    CustomersController.detail
  );

  r.put(
    "/:id",
    auth,
    permit("sales.customer.update"),
    validate(zIdParam, "params"),
    validate(UpdateCustomerDTO),
    CustomersController.update
  );

  r.delete(
    "/:id",
    auth,
    permit("sales.customer.delete"),
    validate(zIdParam, "params"),
    CustomersController.remove
  );

  return r;
}
