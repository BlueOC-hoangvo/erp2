import type { Request, Response, NextFunction } from "express";
import { ok } from "../../common/response";
import { ProductionOrdersService } from "./productionOrders.service";

export class ProductionOrdersController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await ProductionOrdersService.list(req.validated!.query)); }
    catch (e) { return next(e); }
  }
  static async get(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await ProductionOrdersService.get(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }
  static async create(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await ProductionOrdersService.create(req.user?.id ?? null, req.validated!.body)); }
    catch (e) { return next(e); }
  }
  static async update(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await ProductionOrdersService.update(req.validated!.params.id, req.user?.id ?? null, req.validated!.body)); }
    catch (e) { return next(e); }
  }
  static async remove(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await ProductionOrdersService.remove(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }
  static async generateMaterialsFromBom(req: Request, res: Response, next: NextFunction) {
    try {
      const id: bigint = req.validated!.params.id;
      const mode = (req.validated!.query?.mode ?? "replace") as "replace" | "merge";
      return ok(res, await ProductionOrdersService.generateMaterialsFromBom(id, mode));
    } catch (e) {
      return next(e);
    }
  }
  static async release(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await ProductionOrdersService.release(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }
  
  static async start(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await ProductionOrdersService.start(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }
  
  static async done(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await ProductionOrdersService.done(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }
  
  static async cancel(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await ProductionOrdersService.cancel(req.validated!.params.id)); }
    catch (e) { return next(e); }
  }

  // Tạo Production Orders từ Sales Order
  static async createFromSalesOrder(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("=== DEBUG: createFromSalesOrder called ===");
      const salesOrderId: bigint = req.validated!.params.salesOrderId;
      const userId: bigint | null = req.user?.id ?? null;
      
      console.log("Sales Order ID:", salesOrderId.toString());
      console.log("User ID:", userId?.toString() ?? "null");
      
      const result = await ProductionOrdersService.createFromSalesOrder(salesOrderId, userId);
      console.log("=== DEBUG: createFromSalesOrder success ===", result);
      
      return ok(res, result);
    } catch (e) {
      console.log("=== DEBUG: createFromSalesOrder error ===", e);
      return next(e);
    }
  }
  
  
}
