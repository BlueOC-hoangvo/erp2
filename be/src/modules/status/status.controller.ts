import { Response } from "express";
import { ok } from "../../common/response";
import { AuthedRequest } from "../../middleware/auth";
import { StatusService } from "./status.service";

type ReqChange = AuthedRequest & {
  body: {
    entityType: string;
    entityId: bigint;
    toStatus: string;
    note?: string;
  };
};
type ReqHistory = AuthedRequest & {
  query: { entityType: string; entityId: bigint };
};

export class StatusController {
  static async change(req: ReqChange, res: Response) {
    return ok(res, await StatusService.change(req.body, req.user!.id));
  }
  static async history(req: ReqHistory, res: Response) {
    return ok(res, await StatusService.history(req.query));
  }
}
