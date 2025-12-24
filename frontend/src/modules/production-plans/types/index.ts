export interface ProductionPlanEntity {
  id: string;
  planNo: string;
  planName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalQuantity: number;
  completedQuantity: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  customerName?: string;
  salesOrderId?: string;
  items: ProductionPlanItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductionPlanItem {
  id: string;
  productStyleId: string;
  productStyleCode: string;
  productName: string;
  plannedQuantity: number;
  actualQuantity: number;
  unit: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  workCenter: string;
  estimatedHours: number;
  actualHours: number;
  breakdowns: ProductionPlanBreakdown[];
}

export interface ProductionPlanBreakdown {
  id: string;
  sizeCode: string;
  colorCode: string;
  plannedQty: number;
  actualQty: number;
  workStation: string;
}

export const PRODUCTION_PLAN_STATUSES = {
  PLANNED: { label: 'Đã lập kế hoạch', color: 'default' },
  IN_PROGRESS: { label: 'Đang thực hiện', color: 'blue' },
  COMPLETED: { label: 'Hoàn thành', color: 'green' },
  CANCELLED: { label: 'Đã hủy', color: 'red' }
} as const;

export const PRODUCTION_PLAN_PRIORITIES = {
  LOW: { label: 'Thấp', color: 'default' },
  MEDIUM: { label: 'Trung bình', color: 'blue' },
  HIGH: { label: 'Cao', color: 'orange' },
  URGENT: { label: 'Khẩn cấp', color: 'red' }
} as const;
