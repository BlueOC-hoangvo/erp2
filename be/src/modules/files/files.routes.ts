import { Router } from "express";
import multer from "multer";
import { env } from "../../config/env";
import { auth } from "../../middleware/auth";
import { permit } from "../../middleware/permit";
import { validate } from "../../middleware/validate";
import { FilesController } from "./files.controller";
import { AttachFileDTO, EntityFilesQueryDTO } from "./files.dto";

const upload = multer({ dest: env.UPLOAD_DIR });

export function filesRoutes() {
  const r = Router();

  r.post(
    "/upload",
    auth,
    permit("files.upload"),
    upload.single("file"),
    FilesController.upload
  );
  r.post(
    "/attach",
    auth,
    permit("files.attach"),
    validate(AttachFileDTO),
    FilesController.attach
  );
  r.get(
    "/",
    auth,
    permit("files.read"),
    validate(EntityFilesQueryDTO, "query"),
    FilesController.listByEntity
  );

  return r;
}
