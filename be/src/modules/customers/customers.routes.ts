import { Router } from "express";
import { validate } from "../../middleware/validate";
import { auth } from "../../middleware/auth";
import {
  customerCreateDto,
  customerUpdateDto,
  customerQueryDto,
  customerNoteCreateDto,
  zIdParam,
  zCustomerNoteParam,
} from "./customers.dto";
import { CustomersController } from "./customers.controller";

const r = Router();

r.get("/", validate(customerQueryDto, "query"), CustomersController.list);
r.get("/:id", validate(zIdParam, "params"), CustomersController.get);

r.post("/", auth, validate(customerCreateDto, "body"), CustomersController.create);
r.put("/:id", auth, validate(zIdParam, "params"), validate(customerUpdateDto, "body"), CustomersController.update);
r.delete("/:id", auth, validate(zIdParam, "params"), CustomersController.remove);

r.get("/:id/notes", validate(zIdParam, "params"), CustomersController.listNotes);
r.post("/:id/notes", auth, validate(zIdParam, "params"), validate(customerNoteCreateDto, "body"), CustomersController.createNote);
r.delete("/:id/notes/:noteId", auth, validate(zCustomerNoteParam, "params"), CustomersController.removeNote);

export default r;
