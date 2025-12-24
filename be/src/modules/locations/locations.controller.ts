import type { Request, Response, NextFunction } from "express";
import { ok } from "../../common/response";
import { LocationsService } from "./locations.service";

export class LocationsController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await LocationsService.list(req.validated!.query);
      return ok(res, data);
    } catch (e) {
      return next(e);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await LocationsService.create(req.validated!.body);
      return ok(res, data);
    } catch (e) {
      return next(e);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id: bigint = req.validated!.params.id;
      const data = await LocationsService.remove(id);
      return ok(res, data);
    } catch (e) {
      return next(e);
    }
  }
}
