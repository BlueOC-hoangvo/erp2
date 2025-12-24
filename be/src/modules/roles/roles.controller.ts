import { ok } from "../../common/response";
import { RolesService } from "./roles.service";

export class RolesController {
  static async list(req: any, res: any) {
    return ok(res, await RolesService.list(req.query));
  }

  static async detail(req: any, res: any) {
    return ok(res, await RolesService.detail(req.params.id));
  }

  static async create(req: any, res: any) {
    return ok(res, await RolesService.create(req.body, req.user.id));
  }

  static async update(req: any, res: any) {
    return ok(res, await RolesService.update(req.params.id, req.body, req.user.id));
  }

  static async remove(req: any, res: any) {
    return ok(res, await RolesService.remove(req.params.id, req.user.id));
  }

  static async assignPermissions(req: any, res: any) {
    return ok(
      res,
      await RolesService.assignPermissions(req.params.id, req.body.permissionIds, req.user.id)
    );
  }
}
