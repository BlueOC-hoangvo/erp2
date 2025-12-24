import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { StockMovesController } from "./stockMoves.controller";
import { stockMoveCreateDto,stockMoveQueryDto, zIdParam } from "./stockMoves.dto";

const r = Router();

r.post("/", auth, validate(stockMoveCreateDto, "body"), StockMovesController.create);
r.post("/:id/post", auth, validate(zIdParam, "params"), StockMovesController.post);

r.get("/", auth, validate(stockMoveQueryDto, "query"), StockMovesController.list);
r.get("/:id", auth, validate(zIdParam, "params"), StockMovesController.get);
export default r;
