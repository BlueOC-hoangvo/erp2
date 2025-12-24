
import type { Request, Response, NextFunction } from "express";
import { ok } from "../../common/response";
import { PurchaseOrdersService } from "./purchaseOrders.service";

export class PurchaseOrdersController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await PurchaseOrdersService.list(req.validated!.query)); }
    catch (e) { return next(e); }
  }
  static async get(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await PurchaseOrdersService.get(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }
  static async create(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await PurchaseOrdersService.create(req.user?.id ?? null, req.validated!.body)); }
    catch (e) { return next(e); }
  }
  static async update(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await PurchaseOrdersService.update(req.validated!.params.id, req.user?.id ?? null, req.validated!.body)); }
    catch (e) { return next(e); }
  }
  static async remove(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await PurchaseOrdersService.remove(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }
  static async confirm(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await PurchaseOrdersService.confirm(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }
  
  static async receiving(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await PurchaseOrdersService.receiving(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }
  
  static async received(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await PurchaseOrdersService.received(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }
  
  static async cancel(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await PurchaseOrdersService.cancel(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }
  
}
