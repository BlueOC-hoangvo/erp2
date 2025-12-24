import type { Request, Response, NextFunction } from "express";
import { ok } from "../../common/response";
import { CustomersService } from "./customers.service";

type VReq = Request & { validated?: any; user?: any };

export class CustomersController {
  static async list(req: VReq, res: Response, next: NextFunction) {
    try {
      const data = await CustomersService.list(req.validated?.query ?? {
        page: 1, pageSize: 20, sortBy: "createdAt", sortOrder: "desc",
      });
      return ok(res, data);
    } catch (e) {
      return next(e);
    }
  }

  static async get(req: VReq, res: Response, next: NextFunction) {
    try {
      const id: bigint = req.validated.params.id;
      const data = await CustomersService.get(id);
      return ok(res, data);
    } catch (e) {
      return next(e);
    }
  }

  static async create(req: VReq, res: Response, next: NextFunction) {
    try {
      const data = await CustomersService.create(req.validated.body);
      return ok(res, data);
    } catch (e) {
      return next(e);
    }
  }

  static async update(req: VReq, res: Response, next: NextFunction) {
    try {
      const id: bigint = req.validated.params.id;
      const data = await CustomersService.update(id, req.validated.body);
      return ok(res, data);
    } catch (e) {
      return next(e);
    }
  }

  static async remove(req: VReq, res: Response, next: NextFunction) {
    try {
      const id: bigint = req.validated.params.id;
      const data = await CustomersService.remove(id);
      return ok(res, data);
    } catch (e) {
      return next(e);
    }
  }

  static async listNotes(req: VReq, res: Response, next: NextFunction) {
    try {
      const customerId: bigint = req.validated.params.id;
      const data = await CustomersService.listNotes(customerId);
      return ok(res, data);
    } catch (e) {
      return next(e);
    }
  }

  static async createNote(req: VReq, res: Response, next: NextFunction) {
    try {
      const customerId: bigint = req.validated.params.id;
      const userId: bigint | null = req.user?.id ?? null;
      const data = await CustomersService.createNote(customerId, userId, req.validated.body);
      return ok(res, data);
    } catch (e) {
      return next(e);
    }
  }

  static async removeNote(req: VReq, res: Response, next: NextFunction) {
    try {
      const customerId: bigint = req.validated.params.id;
      const noteId: bigint = req.validated.params.noteId;
      const data = await CustomersService.removeNote(customerId, noteId);
      return ok(res, data);
    } catch (e) {
      return next(e);
    }
  }
}
