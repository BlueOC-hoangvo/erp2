// BOM API Services
import { api } from '@/lib/api';
import type {
  Bom,
  BomListParams,
  BomListResponse,
  CreateBomRequest,
  UpdateBomRequest,
  BomExplosionResult,
  BomCostAnalysis,
  BomLeadTime,
  BomVersion,
  CreateBomVersionRequest,
  SubmitForApprovalRequest,
  ApproveRejectRequest,
  BomTemplate,
  BomTemplateListResponse,
  CreateBomTemplateRequest,
  CreateBomFromTemplateRequest,
  BomVersionComparison,
  
} from '../types/bom.types';

// Base BOM API endpoints
const BOM_BASE = '/boms';

// Basic BOM CRUD operations
export const bomApi = {
  // List BOMS with pagination and filters
  list: (params: BomListParams) =>
    api.get<BomListResponse>(BOM_BASE, { params }),

  // Get single BOM by ID
  get: (id: string) =>
    api.get<Bom>(`${BOM_BASE}/${id}`),

  // Create new BOM
  create: (data: CreateBomRequest) =>
    api.post<{ id: string }>(BOM_BASE, data),

  // Update existing BOM
  update: (id: string, data: UpdateBomRequest) =>
    api.put(`${BOM_BASE}/${id}`, data),

  // Delete BOM
  remove: (id: string) =>
    api.delete(`${BOM_BASE}/${id}`),

  // Enhanced BOM Features

  // Explode BOM to get all required materials (multi-level)
  explodeBom: (id: string, quantity: number = 1, bomVersionId?: string) =>
    api.get<BomExplosionResult>(`${BOM_BASE}/${id}/explode`, {
      params: { quantity, bomVersionId }
    }),

  // Calculate BOM cost
  calculateCost: (id: string, quantity: number = 1, bomVersionId?: string) =>
    api.get<BomCostAnalysis>(`${BOM_BASE}/${id}/cost`, {
      params: { quantity, bomVersionId }
    }),

  // Calculate BOM lead time
  calculateLeadTime: (id: string, bomVersionId?: string) =>
    api.get<BomLeadTime>(`${BOM_BASE}/${id}/lead-time`, {
      params: { bomVersionId }
    }),

  // BOM Versioning Operations

  // Create new BOM version
  createVersion: (bomId: string, data: CreateBomVersionRequest) =>
    api.post<{ id: string; versionNo: string }>(`${BOM_BASE}/${bomId}/versions`, data),

  // Submit BOM version for approval
  submitForApproval: (versionId: string, data: SubmitForApprovalRequest) =>
    api.post(`${BOM_BASE}/versions/${versionId}/submit-approval`, data),

  // Approve BOM version
  approveVersion: (versionId: string, data: ApproveRejectRequest) =>
    api.post(`${BOM_BASE}/versions/${versionId}/approve`, data),

  // Reject BOM version
  rejectVersion: (versionId: string, data: ApproveRejectRequest) =>
    api.post(`${BOM_BASE}/versions/${versionId}/reject`, data),

  // Get current BOM version
  getCurrentVersion: (bomId: string) =>
    api.get<BomVersion>(`${BOM_BASE}/${bomId}/current-version`),

  // Compare BOM versions
  compareVersions: (versionId1: string, versionId2: string) =>
    api.get<BomVersionComparison>(`${BOM_BASE}/versions/compare`, {
      params: { versionId1, versionId2 }
    }),

  // BOM Template Operations

  // Create BOM template
  createTemplate: (data: CreateBomTemplateRequest) =>
    api.post<{ id: string }>(`${BOM_BASE}/templates`, data),

  // Get BOM template
  getTemplate: (templateId: string) =>
    api.get<BomTemplate>(`${BOM_BASE}/templates/${templateId}`),

  // Create BOM from template
  createBomFromTemplate: (templateId: string, data: CreateBomFromTemplateRequest) =>
    api.post<{ id: string }>(`${BOM_BASE}/templates/${templateId}/create-bom`, data),

  // List BOM templates
  listTemplates: () =>
    api.get<BomTemplateListResponse>(`${BOM_BASE}/templates`),
};

// Additional utility functions
export const bomUtils = {
  // Format BOM data for forms
  formatBomForForm: (bom: Bom) => ({
    code: bom.code || '',
    name: bom.name,
    productStyleId: bom.productStyleId,
    isActive: bom.isActive,
    lines: bom.lines?.map(line => ({
      itemId: line.itemId,
      uom: line.uom,
      qtyPerUnit: Number(line.qtyPerUnit),
      wastagePercent: Number(line.wastagePercent),
      note: line.note || '',
      isOptional: line.isOptional || false,
      leadTimeDays: line.leadTimeDays || 0
    })) || []
  }),

  // Format BOM data for API submission
  formatBomForApi: (formData: any) => ({
    code: formData.code || undefined,
    name: formData.name,
    productStyleId: formData.productStyleId,
    isActive: formData.isActive,
    lines: formData.lines?.map((line: any) => ({
      itemId: line.itemId,
      uom: line.uom || 'pcs',
      qtyPerUnit: Number(line.qtyPerUnit),
      wastagePercent: Number(line.wastagePercent) || 0,
      note: line.note || undefined,
      isOptional: line.isOptional || false,
      leadTimeDays: line.leadTimeDays || 0
    })) || []
  }),

  // Calculate total quantity with wastage
  calculateEffectiveQty: (qtyPerUnit: number, wastagePercent: number, requiredQty: number = 1) => {
    return requiredQty * qtyPerUnit * (1 + wastagePercent / 100);
  },

  // Format cost for display
  formatCost: (cost: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(cost);
  },

  // Format lead time for display
  formatLeadTime: (days: number) => {
    if (days === 0) return 'Không có';
    if (days === 1) return '1 ngày';
    if (days < 7) return `${days} ngày`;
    if (days < 30) return `${Math.round(days / 7)} tuần`;
    return `${Math.round(days / 30)} tháng`;
  },

  // Get version status color
  getVersionStatusColor: (status: string) => {
    switch (status) {
      case 'DRAFT': return 'gray';
      case 'PENDING_APPROVAL': return 'yellow';
      case 'APPROVED': return 'green';
      case 'REJECTED': return 'red';
      default: return 'gray';
    }
  },

  // Get version status label
  getVersionStatusLabel: (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Bản nháp';
      case 'PENDING_APPROVAL': return 'Chờ phê duyệt';
      case 'APPROVED': return 'Đã phê duyệt';
      case 'REJECTED': return 'Từ chối';
      default: return status;
    }
  }
};
