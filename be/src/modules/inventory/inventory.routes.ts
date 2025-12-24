import { Router } from "express";
import { validate } from "../../middleware/validate";
import { InventoryController } from "./inventory.controller";
import { ledgerQueryDto, onhandQueryDto } from "./inventory.dto";
import { auth } from "../../middleware/auth";

const r = Router();
r.get("/onhand", validate(onhandQueryDto, "query"), InventoryController.onhand);
r.get("/ledger", auth, validate(ledgerQueryDto, "query"), InventoryController.ledger);
export default r;
