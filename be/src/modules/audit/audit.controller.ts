import { Response } from "express";
import { ok } from "../../common/response";
import { AuthedRequest } from "../../middleware/auth";
import { AuditService } from "./audit.service";

export class AuditController {
  static async list(req: AuthedRequest, res: Response) {
    const result = await AuditService.list(req.query);
    return ok(res, result.data, result.meta);
  }
}
