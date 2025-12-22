import { Request, Response } from "express";
import { ok } from "../../common/response";
import { AuthService } from "./auth.service";

export class AuthController {
  static async login(req: Request, res: Response) {
    const data = await AuthService.login(req.body, {
      ip: req.ip,
      userAgent: req.headers["user-agent"]?.toString(),
    });
    return ok(res, data);
  }

  static async refresh(req: Request, res: Response) {
    const data = await AuthService.refresh(req.body, {
      ip: req.ip,
      userAgent: req.headers["user-agent"]?.toString(),
    });
    return ok(res, data);
  }

  static async logout(req: Request, res: Response) {
    const data = await AuthService.logout(req.body);
    return ok(res, data);
  }
}
