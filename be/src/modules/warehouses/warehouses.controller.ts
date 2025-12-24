import { ok } from "../../common/response";
import { WarehousesService } from "./warehouses.service";

export class WarehousesController {
  static list(req: any, res: any, next: any) {
    WarehousesService.list(req.validated.query).then(d => ok(res, d)).catch(next);
  }
  static get(req: any, res: any, next: any) {
    WarehousesService.get(req.validated.params.id).then(d => ok(res, d)).catch(next);
  }
  static create(req: any, res: any, next: any) {
    WarehousesService.create(req.validated.body).then(d => ok(res, d)).catch(next);
  }
  static update(req: any, res: any, next: any) {
    WarehousesService.update(req.validated.params.id, req.validated.body).then(d => ok(res, d)).catch(next);
  }
  static remove(req: any, res: any, next: any) {
    WarehousesService.remove(req.validated.params.id).then(d => ok(res, d)).catch(next);
  }
}
