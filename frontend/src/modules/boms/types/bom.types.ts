// BOM Types based on actual API test results - Updated for production compatibility
// API Response wrapper types (Actual structure from backend tests)
export interface ApiResponse<T> {
  data: T;
  meta: null;
  error: {
    message: string;
    details?: any;
  } | null;
}

export interface Bom {
  id: string;
  code?: string;
  name: string;
  productStyleId: string;
  productStyle?: ProductStyle;
  isActive: boolean;
  createdById?: string;
  createdBy?: User;
  createdAt?: string;
  updatedAt?: string;
  note?: string; // Added based on actual API test results
  lines?: BomLine[];
  currentVersion?: BomVersion;
  totalLines?: number;
  totalMaterialCost?: number;
}

export interface BomLine {
  id: string;
  bomId: string;
  itemId: string;
  item?: Item;
  uom: string;
  qtyPerUnit: string; // Decimal format from API
  wastagePercent: string; // Decimal format from API
  lineNo?: number;
  note?: string;
  isOptional?: boolean;
  leadTimeDays?: number;
  subBomId?: string;
}

export interface Item {
  id: string;
  code?: string;
  name: string;
  sku?: string;
  baseUom?: string;
  itemType?: string;
}

export interface ProductStyle {
  id: string;
  code?: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  fullName: string;
  email?: string;
}

// BOM Versioning Types
export interface BomVersion {
  id: string;
  bomId: string;
  versionNo: string;
  description?: string;
  effectiveFrom?: string;
  parentVersionId?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  isCurrent?: boolean;
  createdById?: string;
  approvedById?: string;
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  bom?: Bom;
  approvals?: BomApproval[];
}

export interface BomApproval {
  id: string;
  bomVersionId: string;
  approverId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comments?: string;
  approvedAt?: string;
  createdAt?: string;
}

// BOM Explosion Types (Simplified based on actual API test results)
export interface BomExplosionItem {
  itemId: string;
  itemName: string;
  sku?: string;
  uom: string;
  qtyRequired: number;
  itemType?: string;
  // Simplified structure - no calculations, level, sourceBomLineId, etc.
}

export interface BomExplosionResult {
  items: BomExplosionItem[];
  totalItems: number;
  quantity: number;
  // Simplified structure - no bomId, bomVersionId, summary, etc.
}

// BOM Cost Analysis Types (Simplified based on actual API test results)
export interface BomCostItem extends BomExplosionItem {
  unitCost?: number;
  totalCost?: number;
}

export interface BomCostAnalysis {
  totalMaterialCost: number;
  materialCosts: BomCostItem[];
  // Simplified structure - no bomId, bomVersionId, quantity, currency, costType, summary
}

// BOM Lead Time Types (Simplified based on actual API test results)
export interface BomLeadTime {
  maxLeadTime: number;
  totalLeadTime: number;
  estimatedDays: number;
  // Simplified structure - matches actual API response
}

// BOM Templates Types
export interface BomTemplate {
  id: string;
  name: string;
  code?: string;
  description?: string;
  category?: string;
  templateData: any;
  usageCount: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BomTemplateListResponse {
  page: number;
  pageSize: number;
  total: number;
  items: BomTemplate[];
}

// BOM Comparison Types
export interface BomVersionComparison {
  version1: {
    id: string;
    versionNo: string;
    status: string;
  };
  version2: {
    id: string;
    versionNo: string;
    status: string;
  };
  differences: BomDifference[];
}

export interface BomDifference {
  type: 'ADDED' | 'REMOVED' | 'MODIFIED';
  lineId?: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  description?: string;
}

// API Request/Response Types
export interface CreateBomRequest {
  code?: string;
  name: string;
  productStyleId: string;
  isActive?: boolean;
  lines: CreateBomLineRequest[];
}

export interface CreateBomLineRequest {
  itemId: string;
  uom?: string;
  qtyPerUnit: number;
  wastagePercent?: number;
  note?: string;
  isOptional?: boolean;
  leadTimeDays?: number;
}

export interface UpdateBomRequest extends Partial<CreateBomRequest> {
  lines?: CreateBomLineRequest[];
}

export interface BomListParams {
  q?: string;
  productStyleId?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

export interface BomListResponse {
  page: number;
  pageSize: number;
  total: number;
  items: Bom[];
}

export interface CreateBomVersionRequest {
  versionNo: string;
  description?: string;
  effectiveFrom?: string;
  parentVersionId?: string;
  createdById?: string;
  changes?: Array<{
    type: 'LINE_MODIFIED' | 'LINE_ADDED' | 'LINE_REMOVED';
    field?: string;
    oldValue?: any;
    newValue?: any;
    description?: string;
  }>;
}

export interface SubmitForApprovalRequest {
  approvers: string[];
}

export interface ApproveRejectRequest {
  comments?: string;
}

export interface CreateBomTemplateRequest {
  name: string;
  code?: string;
  description?: string;
  category?: string;
  templateData: {
    lines: CreateBomLineRequest[];
  };
}

export interface CreateBomFromTemplateRequest {
  code: string;
  productStyleId: string;
  name: string;
  isActive?: boolean;
}

export interface CompareVersionsRequest {
  versionId1: string;
  versionId2: string;
}

// Form Types for UI
export interface BomFormData {
  code?: string;
  name: string;
  productStyleId: string;
  isActive: boolean;
  lines: BomLineFormData[];
}

export interface BomLineFormData {
  itemId: string;
  uom: string;
  qtyPerUnit: number;
  wastagePercent: number;
  note?: string;
  isOptional: boolean;
  leadTimeDays?: number;
}

export interface BomVersionFormData {
  versionNo: string;
  description?: string;
  effectiveFrom?: string;
  parentVersionId?: string;
}

export interface BomTemplateFormData {
  name: string;
  code?: string;
  description?: string;
  category?: string;
  lines: BomLineFormData[];
}

// Special response types for API endpoints
export interface BomCurrentVersionResponse {
  message?: string; // When no version found
  bom?: Bom; // When version is found
  version?: BomVersion; // Alternative structure
}

// Versioning response types
export interface BomVersionListResponse {
  items: BomVersion[];
  total: number;
}

export interface BomVersionApprovalResponse {
  success: boolean;
  message: string;
  data?: BomVersion;
}

