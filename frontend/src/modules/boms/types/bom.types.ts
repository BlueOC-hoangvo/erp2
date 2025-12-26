// BOM Types based on backend structure

export interface Bom {
  id: string;
  code?: string;
  name: string;
  productStyleId: string;
  productStyle?: ProductStyle;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  lines?: BomLine[];
}

export interface BomLine {
  id: string;
  bomId: string;
  itemId: string;
  item?: Item;
  uom: string;
  qtyPerUnit: number;
  wastagePercent: number;
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

// BOM Explosion Types
export interface BomExplosionItem {
  itemId: string;
  itemName: string;
  sku?: string;
  uom: string;
  qtyRequired: number;
  itemType?: string;
  level?: number;
  isOptional?: boolean;
  parentItemId?: string;
}

export interface BomExplosionResult {
  items: BomExplosionItem[];
  totalItems: number;
  quantity: number;
}

// BOM Cost Analysis Types
export interface BomCostItem extends BomExplosionItem {
  unitCost?: number;
  totalCost?: number;
}

export interface BomCostAnalysis {
  totalMaterialCost: number;
  materialCosts: BomCostItem[];
  quantity: number;
}

// BOM Lead Time Types
export interface BomLeadTime {
  maxLeadTime: number;
  totalLeadTime: number;
  estimatedDays: number;
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
  createdById: string;
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
