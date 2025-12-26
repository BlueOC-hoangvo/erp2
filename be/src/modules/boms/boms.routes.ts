import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { BomsController } from "./boms.controller";
import { 
  bomCreateDto, 
  bomUpdateDto, 
  bomQueryDto, 
  zIdParam,
  bomExplosionQueryDto,
  bomCostQueryDto,
  bomLeadTimeQueryDto,
  bomVersionCreateDto,
  submitApprovalDto,
  approveRejectDto,
  bomTemplateCreateDto,
  bomFromTemplateDto,
  compareVersionsDto,
  bomTemplateQueryDto
} from "./boms.dto";

const r = Router();

// Basic CRUD operations
r.get("/", validate(bomQueryDto, "query"), BomsController.list);
r.get("/:id", validate(zIdParam, "params"), BomsController.get);

r.post("/", auth, validate(bomCreateDto, "body"), BomsController.create);
r.put("/:id", auth, validate(zIdParam, "params"), validate(bomUpdateDto, "body"), BomsController.update);
r.delete("/:id", auth, validate(zIdParam, "params"), BomsController.remove);

// Enhanced BOM Features
r.get("/:id/explode", validate(zIdParam, "params"), validate(bomExplosionQueryDto, "query"), BomsController.explodeBom);
r.get("/:id/cost", validate(zIdParam, "params"), validate(bomCostQueryDto, "query"), BomsController.calculateCost);
r.get("/:id/lead-time", validate(zIdParam, "params"), validate(bomLeadTimeQueryDto, "query"), BomsController.calculateLeadTime);

// BOM Versioning
r.post("/:id/versions", auth, validate(zIdParam, "params"), validate(bomVersionCreateDto, "body"), BomsController.createVersion);
r.get("/:id/current-version", validate(zIdParam, "params"), BomsController.getCurrentVersion);
r.post("/versions/:versionId/submit-approval", auth, validate(zIdParam, "params"), validate(submitApprovalDto, "body"), BomsController.submitForApproval);
r.post("/versions/:versionId/approve", auth, validate(zIdParam, "params"), validate(approveRejectDto, "body"), BomsController.approveVersion);
r.post("/versions/:versionId/reject", auth, validate(zIdParam, "params"), validate(approveRejectDto, "body"), BomsController.rejectVersion);
r.get("/versions/compare", validate(compareVersionsDto, "query"), BomsController.compareVersions);

// BOM Templates
r.post("/templates", auth, validate(bomTemplateCreateDto, "body"), BomsController.createTemplate);
r.get("/templates/:templateId", validate(zIdParam, "params"), BomsController.getTemplate);
r.post("/templates/:templateId/create-bom", auth, validate(zIdParam, "params"), validate(bomFromTemplateDto, "body"), BomsController.createBomFromTemplate);
r.get("/templates", validate(bomTemplateQueryDto, "query"), BomsController.listTemplates);

export default r;
