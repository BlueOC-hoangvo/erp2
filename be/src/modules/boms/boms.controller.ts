import type { Request, Response, NextFunction } from "express";
import { ok } from "../../common/response";
import { BomsService } from "./boms.service";

export class BomsController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await BomsService.list(req.validated!.query)); }
    catch (e) { return next(e); }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await BomsService.get(BigInt(req.validated!.params.id))); }
    catch (e) { return next(e); }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await BomsService.create(req.validated!.body)); }
    catch (e) { return next(e); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await BomsService.update(BigInt(req.validated!.params.id), req.validated!.body)); }
    catch (e) { return next(e); }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try { return ok(res, await BomsService.remove(BigInt(req.validated!.params.id))); }
    catch (e) { return next(e); }
  }

  // ===========================================
  // 🚀 NEW: Enhanced BOM Endpoints - Phase 1
  // ===========================================

  /**
   * Explode BOM to get all required materials (multi-level)
   */
  static async explodeBom(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validated!.params;
      const { quantity, bomVersionId } = req.validated!.query;
      
      const result = await BomsService.explodeBom(
        BigInt(id),
        quantity ? Number(quantity) : 1,
        bomVersionId ? BigInt(bomVersionId as string) : undefined
      );
      
      return ok(res, result);
    } catch (e) { return next(e); }
  }

  /**
   * Calculate BOM cost
   */
  static async calculateCost(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validated!.params;
      const { quantity, bomVersionId } = req.validated!.query;
      
      const result = await BomsService.calculateBomCost(
        BigInt(id),
        quantity ? Number(quantity) : 1,
        bomVersionId ? BigInt(bomVersionId as string) : undefined
      );
      
      return ok(res, result);
    } catch (e) { return next(e); }
  }

  /**
   * Calculate BOM lead time
   */
  static async calculateLeadTime(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validated!.params;
      const { bomVersionId } = req.validated!.query;
      
      const result = await BomsService.calculateBomLeadTime(
        BigInt(id),
        bomVersionId ? BigInt(bomVersionId as string) : undefined
      );
      
      return ok(res, result);
    } catch (e) { return next(e); }
  }

  // ===========================================
  // BOM Versioning Endpoints
  // ===========================================

  /**
   * Create new BOM version
   */
  static async createVersion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validated!.params;
      
      const result = await BomsService.createVersion(
        BigInt(id),
        req.validated!.body
      );
      
      return ok(res, result);
    } catch (e) { return next(e); }
  }

  /**
   * Submit BOM version for approval
   */
  static async submitForApproval(req: Request, res: Response, next: NextFunction) {
    try {
      const { versionId } = req.validated!.params;
      const { approvers } = req.validated!.body;
      
      const result = await BomsService.submitForApproval(
        BigInt(versionId),
        approvers.map((id: string) => BigInt(id))
      );
      
      return ok(res, result);
    } catch (e) { return next(e); }
  }

  /**
   * Approve BOM version
   */
  static async approveVersion(req: Request, res: Response, next: NextFunction) {
    try {
      const { versionId } = req.validated!.params;
      const { comments } = req.validated!.body;
      const approverId = (req as any).user?.id; // Get from auth
      
      const result = await BomsService.approveVersion(
        BigInt(versionId),
        BigInt(approverId || '1'), // Default to user 1 for testing
        comments
      );
      
      return ok(res, result);
    } catch (e) { return next(e); }
  }

  /**
   * Reject BOM version
   */
  static async rejectVersion(req: Request, res: Response, next: NextFunction) {
    try {
      const { versionId } = req.validated!.params;
      const { comments } = req.validated!.body;
      const approverId = (req as any).user?.id; // Get from auth
      
      const result = await BomsService.rejectVersion(
        BigInt(versionId),
        BigInt(approverId || '1'), // Default to user 1 for testing
        comments
      );
      
      return ok(res, result);
    } catch (e) { return next(e); }
  }

  /**
   * Get current BOM version
   */
  static async getCurrentVersion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.validated!.params;
      
      const result = await BomsService.getCurrentVersion(BigInt(id));
      
      return ok(res, result);
    } catch (e) { return next(e); }
  }

  /**
   * Compare BOM versions
   */
  static async compareVersions(req: Request, res: Response, next: NextFunction) {
    try {
      const { versionId1, versionId2 } = req.validated!.query;
      
      const result = await BomsService.compareVersions(
        BigInt(versionId1 as string),
        BigInt(versionId2 as string)
      );
      
      return ok(res, result);
    } catch (e) { return next(e); }
  }

  // ===========================================
  // BOM Templates Endpoints
  // ===========================================

  /**
   * Create BOM template
   */
  static async createTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await BomsService.createTemplate(req.validated!.body);
      return ok(res, result);
    } catch (e) { return next(e); }
  }

  /**
   * Get BOM template
   */
  static async getTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const { templateId } = req.validated!.params;
      
      const result = await BomsService.getTemplate(BigInt(templateId));
      return ok(res, result);
    } catch (e) { return next(e); }
  }

  /**
   * Create BOM from template
   */
  static async createBomFromTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const { templateId } = req.validated!.params;
      
      const result = await BomsService.createBomFromTemplate(
        BigInt(templateId),
        req.validated!.body
      );
      
      return ok(res, result);
    } catch (e) { return next(e); }
  }

  /**
   * List BOM templates
   */
  static async listTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await BomsService.listTemplates(req.validated!.query);
      return ok(res, result);
    } catch (e) { return next(e); }
  }
}
