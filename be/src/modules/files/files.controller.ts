import { Response } from "express";
import path from "path";
import { ok } from "../../common/response";
import { E } from "../../common/errors";
import { AuthedRequest } from "../../middleware/auth";
import { FilesService } from "./files.service";

type ReqFilesAttach = AuthedRequest & {
  body: { entityType: string; entityId: bigint; fileId: bigint; tag?: string };
};

type ReqEntityFiles = AuthedRequest & {
  query: { entityType: string; entityId: bigint };
};

export class FilesController {
  static async upload(req: AuthedRequest, res: Response) {
    if (!req.file) throw E.badRequest("No file uploaded");

    const publicUrl = `/uploads/${path.basename(req.file.path)}`;
    const created = await FilesService.saveUploadedFile({
      path: req.file.path,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      uploadedById: req.user!.id,
      publicUrl,
    });

    return ok(res, created);
  }

  static async attach(req: ReqFilesAttach, res: Response) {
    return ok(res, await FilesService.attachFile(req.body, req.user!.id));
  }

  static async listByEntity(req: ReqEntityFiles, res: Response) {
    const { entityType, entityId } = req.query;
    return ok(res, await FilesService.listByEntity(entityType, entityId));
  }
}
