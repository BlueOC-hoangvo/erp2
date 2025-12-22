import { Response } from "express";
import { AuthedRequest } from "../../middleware/auth";
import { ok } from "../../common/response";
import { MeService } from "./me.service";

export class MeController {
  static async me(req: AuthedRequest, res: Response) {
    const data = await MeService.getMe(req.user!.id);
    return ok(res, data);
  }

  static async permissions(req: AuthedRequest, res: Response) {
    const data = await MeService.getPermissions(req.user!.id);
    return ok(res, data);
  }

  static async menu(req: AuthedRequest, res: Response) {
    const data = await MeService.getMenu(req.user!.id);
    return ok(res, data);
  }
}
