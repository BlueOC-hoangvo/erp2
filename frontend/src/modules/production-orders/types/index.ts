export interface ProductionOrderEntity {
  id: string;
  orderNo: string;
  planId: string;
  productStyleId: string;
  productStyleCode: string;
  productName: string;
  customerName?: string;
  totalQuantity: number;
  completedQuantity: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate: string;
  endDate: string;
  estimatedHours: number;
  actualHours: number;
  assignedTeam: string;
  workCenters: string[];
  items: ProductionOrderItem[];
  materials: ProductionOrderMaterial[];
  qualityChecks: QualityCheck[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface ProductionOrderMaterial {
  id: string;
  materialCode: string;
  materialName: string;
  requiredQty: number;
  consumedQty: number;
  unit: string;
  status: 'PENDING' | 'PARTIAL' | 'COMPLETED';
}

export interface QualityCheck {
  id: string;
  checkPoint: string;
  result: 'PASS' | 'FAIL' | 'PENDING';
  checkedBy: string;
  checkedAt: string;
  notes?: string;
}

export interface ProductionOrderStatus {
  key: string;
  label: string;
  color: string;
}

export const PRODUCTION_ORDER_STATUSES: ProductionOrderStatus[] = [
  { key: 'PENDING', label: 'Chờ xử lý', color: 'orange' },
  { key: 'IN_PROGRESS', label: 'Đang sản xuất', color: 'blue' },
  { key: 'COMPLETED', label: 'Hoàn thành', color: 'green' },
  { key: 'CANCELLED', label: 'Hủy bỏ', color: 'red' },
];

export const PRIORITY_LEVELS = [
  { key: 'LOW', label: 'Thấp', color: 'default' },
  { key: 'MEDIUM', label: 'Trung bình', color: 'blue' },
  { key: 'HIGH', label: 'Cao', color: 'orange' },
  { key: 'URGENT', label: 'Khẩn cấp', color: 'red' },
];
