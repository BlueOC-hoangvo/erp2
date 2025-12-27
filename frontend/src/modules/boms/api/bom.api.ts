// BOM API Services - Real API implementation
import { api, unwrap } from '@/lib/api';
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

// Real API implementation
export const bomApi = {
  // List BOMS with pagination and filters
  list: async (params: BomListParams = {}) => {
    console.log('🔥 BOM API - List called with params:', params);
    
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.append('q', params.q);
    if (params.productStyleId) queryParams.append('productStyleId', params.productStyleId);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    
    const url = `/boms${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('🔥 BOM API - Making request to:', url);
    
    const response = await unwrap<{ items: Bom[]; page: number; pageSize: number; total: number }>(
      api.get(url)
    );
    
    console.log('🔥 BOM API - Returning response:', response);
    return {
      items: response.data.items || [],
      page: response.data.page || 1,
      pageSize: response.data.pageSize || 10,
      total: response.data.total || 0
    };
  },

  // Get single BOM by ID
  get: async (id: string) => {
    console.log('🔥 BOM API - Get called with id:', id);
    const response = await unwrap<Bom>(api.get(`/boms/${id}`));
    console.log('🔥 BOM API - Returning BOM:', response);
    return response.data;
  },

  // Create new BOM
  create: async (data: CreateBomRequest) => {
    console.log('🔥 BOM API - Create called with data:', data);
    const response = await unwrap<{ id: string }>(api.post('/boms', data));
    console.log('🔥 BOM API - Created BOM with id:', response.data.id);
    return response.data;
  },

  // Update existing BOM
  update: async (id: string, data: UpdateBomRequest) => {
    console.log('🔥 BOM API - Update called with id:', id, 'data:', data);
    await unwrap(api.put(`/boms/${id}`, data));
    console.log('🔥 BOM API - Updated BOM successfully');
    return { ok: true };
  },

  // Delete BOM
  remove: async (id: string) => {
    console.log('🔥 BOM API - Remove called with id:', id);
    await unwrap(api.delete(`/boms/${id}`));
    console.log('🔥 BOM API - Removed BOM successfully');
    return { ok: true };
  },

  // Enhanced BOM Features - Real API implementations

  // Explode BOM to get all required materials (multi-level)
  explodeBom: async (id: string, quantity: number = 1, bomVersionId?: string) => {
    console.log('🔥 BOM API - Explode called with id:', id, 'quantity:', quantity, 'versionId:', bomVersionId);
    
    const queryParams = new URLSearchParams();
    queryParams.append('quantity', quantity.toString());
    if (bomVersionId) queryParams.append('bomVersionId', bomVersionId);
    
    const response = await unwrap<{ items: any[]; totalItems: number; quantity: number }>(
      api.get(`/boms/${id}/explode?${queryParams.toString()}`)
    );
    
    console.log('🔥 BOM API - Explosion result:', response);
    return {
      items: response.data.items || [],
      totalItems: response.data.totalItems || 0,
      quantity: response.data.quantity || 1
    };
  },

  // Calculate BOM cost
  calculateCost: async (id: string, quantity: number = 1, bomVersionId?: string) => {
    console.log('🔥 BOM API - Calculate cost called with id:', id, 'quantity:', quantity, 'versionId:', bomVersionId);
    
    const queryParams = new URLSearchParams();
    queryParams.append('quantity', quantity.toString());
    if (bomVersionId) queryParams.append('bomVersionId', bomVersionId);
    
    const response = await unwrap<{ totalMaterialCost: number; materialCosts: any[]; quantity: number }>(
      api.get(`/boms/${id}/cost?${queryParams.toString()}`)
    );
    
    console.log('🔥 BOM API - Cost analysis result:', response);
    return {
      totalMaterialCost: response.data.totalMaterialCost || 0,
      materialCosts: response.data.materialCosts || [],
      quantity: response.data.quantity || 1
    };
  },

  // Calculate BOM lead time
  calculateLeadTime: async (id: string, bomVersionId?: string) => {
    console.log('🔥 BOM API - Calculate lead time called with id:', id, 'versionId:', bomVersionId);
    
    const queryParams = new URLSearchParams();
    if (bomVersionId) queryParams.append('bomVersionId', bomVersionId);
    
    const response = await unwrap<{ maxLeadTime: number; totalLeadTime: number; estimatedDays: number }>(
      api.get(`/boms/${id}/lead-time${queryParams.toString() ? `?${queryParams.toString()}` : ''}`)
    );
    
    console.log('🔥 BOM API - Lead time result:', response);
    return {
      maxLeadTime: response.data.maxLeadTime || 0,
      totalLeadTime: response.data.totalLeadTime || 0,
      estimatedDays: response.data.estimatedDays || 0
    };
  },

  // BOM Versioning Operations - Real API implementations
  createVersion: async (bomId: string, data: CreateBomVersionRequest) => {
    console.log('🔥 BOM API - Create version called with bomId:', bomId, 'data:', data);
    const response = await unwrap<{ id: string; versionNo: string }>(
      api.post(`/boms/${bomId}/versions`, data)
    );
    console.log('🔥 BOM API - Created version:', response);
    return response.data;
  },

  submitForApproval: async (versionId: string, data: SubmitForApprovalRequest) => {
    console.log('🔥 BOM API - Submit for approval called with versionId:', versionId, 'data:', data);
    await unwrap(api.post(`/boms/versions/${versionId}/submit-approval`, data));
    console.log('🔥 BOM API - Submitted for approval successfully');
    return { ok: true };
  },

  approveVersion: async (versionId: string, data: ApproveRejectRequest) => {
    console.log('🔥 BOM API - Approve version called with versionId:', versionId, 'data:', data);
    await unwrap(api.post(`/boms/versions/${versionId}/approve`, data));
    console.log('🔥 BOM API - Approved version successfully');
    return { ok: true };
  },

  rejectVersion: async (versionId: string, data: ApproveRejectRequest) => {
    console.log('🔥 BOM API - Reject version called with versionId:', versionId, 'data:', data);
    await unwrap(api.post(`/boms/versions/${versionId}/reject`, data));
    console.log('🔥 BOM API - Rejected version successfully');
    return { ok: true };
  },

  getCurrentVersion: async (bomId: string) => {
    console.log('🔥 BOM API - Get current version called with bomId:', bomId);
    const response = await unwrap<BomVersion>(api.get(`/boms/${bomId}/current-version`));
    console.log('🔥 BOM API - Current version:', response);
    return response.data;
  },

  compareVersions: async (versionId1: string, versionId2: string) => {
    console.log('🔥 BOM API - Compare versions called with versionId1:', versionId1, 'versionId2:', versionId2);
    const response = await unwrap<BomVersionComparison>(
      api.get(`/boms/versions/compare?versionId1=${versionId1}&versionId2=${versionId2}`)
    );
    console.log('🔥 BOM API - Version comparison result:', response);
    return response.data;
  },

  // BOM Template Operations - Real API implementations
  listTemplates: async (params?: { page?: number; pageSize?: number; q?: string }) => {
    console.log('🔥 TEMPLATE API - listTemplates called with params:', params);
    
    const queryParams = new URLSearchParams();
    if (params?.q) queryParams.append('q', params.q);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    
    const url = `/boms/templates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('🔥 TEMPLATE API - Making request to:', url);
    
    const response = await unwrap<{ items: BomTemplate[]; page: number; pageSize: number; total: number }>(
      api.get(url)
    );
    
    console.log('🔥 TEMPLATE API - Returning response:', response);
    return {
      items: response.data.items || [],
      page: response.data.page || 1,
      pageSize: response.data.pageSize || 10,
      total: response.data.total || 0
    };
  },

  getTemplate: async (templateId: string) => {
    console.log('🔥 TEMPLATE API - getTemplate called with templateId:', templateId);
    const response = await unwrap<BomTemplate>(api.get(`/boms/templates/${templateId}`));
    console.log('🔥 TEMPLATE API - Returning template:', response);
    return response.data;
  },

  createTemplate: async (data: CreateBomTemplateRequest) => {
    console.log('🔥 TEMPLATE API - createTemplate called with data:', data);
    const response = await unwrap<{ id: string }>(api.post('/boms/templates', data));
    console.log('🔥 TEMPLATE API - Created template with id:', response.data.id);
    return response.data;
  },

  createBomFromTemplate: async (templateId: string, data: CreateBomFromTemplateRequest) => {
    console.log('🔥 TEMPLATE API - createBomFromTemplate called with templateId:', templateId, 'data:', data);
    const response = await unwrap<{ id: string }>(api.post(`/boms/templates/${templateId}/create-bom`, data));
    console.log('🔥 TEMPLATE API - Created BOM from template with id:', response.data.id);
    return response.data;
  },
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
