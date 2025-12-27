// Backend API Types - Production Orders
export interface ProductionOrderBreakdown {
  id: number;
  productVariantId: number;
  qtyPlan: number;
  qtyCompleted: number;
  productVariant?: {
    id: number;
    name: string;
    sku?: string;
    size?: {
      id: number;
      name: string;
      code: string;
    };
    color?: {
      id: number;
      name: string;
      code: string;
    };
  };
}

export interface ProductionOrderMaterial {
  id: number;
  itemId: number;
  uom: string;
  qtyRequired: number;
  qtyIssued: number;
  wastagePercent: number;
  item?: {
    id: number;
    name: string;
    sku?: string;
    code?: string;
  };
}

export interface ProductionOrderEntity {
  id: number;
  moNo: string;
  salesOrderItemId?: number;
  productStyleId: number;
  productStyle?: {
    id: number;
    name: string;
    code: string;
  };
  qtyPlan: number;
  qtyCompleted: number;
  startDate?: string;
  dueDate?: string;
  status: "DRAFT" | "RELEASED" | "RUNNING" | "DONE" | "CANCELLED";
  note?: string;
  breakdowns: ProductionOrderBreakdown[];
  materialRequirements: ProductionOrderMaterial[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductionOrderCreate {
  moNo: string;
  salesOrderItemId?: number;
  productStyleId: number;
  qtyPlan: number;
  startDate?: string;
  dueDate?: string;
  status?: "DRAFT" | "RELEASED" | "RUNNING" | "DONE" | "CANCELLED";
  note?: string;
  breakdowns?: Array<{
    productVariantId: number;
    qtyPlan: number;
    qtyCompleted?: number;
  }>;
  materialRequirements?: Array<{
    itemId: number;
    uom?: string;
    qtyRequired: number;
    qtyIssued?: number;
    wastagePercent?: number;
  }>;
}

export interface ProductionOrderUpdate extends Partial<ProductionOrderCreate> {
  productStyleId?: number;
  qtyPlan?: number;
}

export interface ProductionOrderQuery {
  q?: string;
  status?: "DRAFT" | "RELEASED" | "RUNNING" | "DONE" | "CANCELLED";
  productStyleId?: number;
  page?: number;
  pageSize?: number;
}

export interface ProductionOrderStats {
  totalOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  completionRate: number;
}

export interface ProductionOrderStatus {
  key: string;
  label: string;
  color: string;
}

export const PRODUCTION_ORDER_STATUSES: ProductionOrderStatus[] = [
  { key: 'DRAFT', label: 'Nháp', color: 'default' },
  { key: 'RELEASED', label: 'Đã phát hành', color: 'blue' },
  { key: 'RUNNING', label: 'Đang chạy', color: 'orange' },
  { key: 'DONE', label: 'Hoàn thành', color: 'green' },
  { key: 'CANCELLED', label: 'Hủy bỏ', color: 'red' },
];

// Legacy types for compatibility
export interface ProductionOrderItem {
  id: string;
  sizeCode: string;
  colorCode: string;
  plannedQty: number;
  completedQty: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  workCenter: string;
  assignedWorker?: string;
  startTime?: string;
  endTime?: string;
}

export interface QualityCheck {
  id: string;
  checkPoint: string;
  result: 'PASS' | 'FAIL' | 'PENDING';
  checkedBy: string;
  checkedAt: string;
  notes?: string;
}
