import { ok } from "../../common/response";
import { UsersService } from "./users.service";

export class UsersController {
  static async list(req: any, res: any) {
    return ok(res, await UsersService.list(req.query));
  }

  static async create(req: any, res: any) {
    return ok(res, await UsersService.create(req.body, req.user.id));
  }

  static async update(req: any, res: any) {
    return ok(res, await UsersService.update(req.params.id, req.body, req.user.id));
  }

  static async resetPassword(req: any, res: any) {
    return ok(res, await UsersService.resetPassword(req.params.id, req.body.password, req.user.id));
  }

  static async remove(req: any, res: any) {
    return ok(res, await UsersService.remove(req.params.id, req.user.id));
  }
}
