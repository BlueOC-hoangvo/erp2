import { Response } from "express";
import { ok } from "../../common/response";
import { AuthedRequest } from "../../middleware/auth";
import { CustomersService } from "./customers.service";

type ReqWithBigIntId = AuthedRequest & { params: { id: bigint } };

export class CustomersController {
  static async list(req: AuthedRequest, res: Response) {
    const q = (req as any).validated?.query ?? req.query;
    const result = await CustomersService.list(q as any);
    return ok(res, result.data, result.meta);
  }

  static async create(req: AuthedRequest, res: Response) {
    return ok(res, await CustomersService.create(req.body, req.user!.id));
  }

  static async detail(req: ReqWithBigIntId, res: Response) {
    return ok(res, await CustomersService.detail(req.params.id));
  }

  static async update(req: ReqWithBigIntId, res: Response) {
    return ok(
      res,
      await CustomersService.update(req.params.id, req.body, req.user!.id)
    );
  }

  static async remove(req: ReqWithBigIntId, res: Response) {
    return ok(res, await CustomersService.remove(req.params.id, req.user!.id));
  }
}
