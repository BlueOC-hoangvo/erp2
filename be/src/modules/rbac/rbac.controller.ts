import { Response } from "express";
import { ok } from "../../common/response";
import { AuthedRequest } from "../../middleware/auth";
import { RbacService } from "./rbac.service";

type ReqWithBigIntId = AuthedRequest & { params: { id: bigint } };

export class RbacController {
  static async listPermissions(_req: AuthedRequest, res: Response) {
    return ok(res, await RbacService.listPermissions());
  }

  static async listRoles(_req: AuthedRequest, res: Response) {
    return ok(res, await RbacService.listRoles());
  }

  static async createRole(req: AuthedRequest, res: Response) {
    return ok(res, await RbacService.createRole(req.body, req.user!.id));
  }

  static async updateRole(req: ReqWithBigIntId, res: Response) {
    return ok(
      res,
      await RbacService.updateRole(req.params.id, req.body, req.user!.id)
    );
  }

  static async deleteRole(req: ReqWithBigIntId, res: Response) {
    return ok(res, await RbacService.deleteRole(req.params.id, req.user!.id));
  }

  static async assignRolePermissions(req: ReqWithBigIntId, res: Response) {
    return ok(
      res,
      await RbacService.assignRolePermissions(
        req.params.id,
        req.body.permissionIds,
        req.user!.id
      )
    );
  }

  static async listUsers(_req: AuthedRequest, res: Response) {
    return ok(res, await RbacService.listUsers());
  }

  static async assignUserRoles(req: ReqWithBigIntId, res: Response) {
    return ok(
      res,
      await RbacService.assignUserRoles(
        req.params.id,
        req.body.roleIds,
        req.user!.id
      )
    );
  }
}
