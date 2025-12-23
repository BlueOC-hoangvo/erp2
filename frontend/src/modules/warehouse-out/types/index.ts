export interface WarehouseOutEntity {
  id: string;
  outNo: string;
  outType: 'SALE' | 'TRANSFER' | 'PRODUCTION' | 'DAMAGE' | 'RETURN';
  warehouseId: string;
  warehouseName: string;
  customerId?: string;
  customerName?: string;
  salesOrderId?: string;
  productionOrderId?: string;
  reference?: string;
  totalValue: number;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  outDate: string;
  approvedBy?: string;
  approvedAt?: string;
  completedBy?: string;
  completedAt?: string;
  items: WarehouseOutItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseOutItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  unit: string;
  requestedQty: number;
  outQty: number;
  unitPrice: number;
  totalPrice: number;
  warehouseArea: string;
  shelfLocation?: string;
  batchNo?: string;
  expiryDate?: string;
  status: 'PENDING' | 'PARTIAL' | 'COMPLETED';
}

export interface WarehouseArea {
  id: string;
  areaCode: string;
  areaName: string;
  warehouseId: string;
  areaType: 'STORAGE' | 'PICKING' | 'RECEIVING' | 'SHIPPING';
  capacity: number;
  currentLoad: number;
  temperature?: string;
  humidity?: string;
  isActive: boolean;
  createdAt: string;
}

export interface WarehouseOutStatus {
  key: string;
  label: string;
  color: string;
}

export const WAREHOUSE_OUT_STATUSES: WarehouseOutStatus[] = [
  { key: 'DRAFT', label: 'Nháp', color: 'default' },
  { key: 'PENDING', label: 'Chờ phê duyệt', color: 'orange' },
  { key: 'APPROVED', label: 'Đã phê duyệt', color: 'blue' },
  { key: 'COMPLETED', label: 'Hoàn thành', color: 'green' },
  { key: 'CANCELLED', label: 'Hủy bỏ', color: 'red' },
];

export const OUT_TYPES = [
  { key: 'SALE', label: 'Bán hàng', color: 'blue' },
  { key: 'TRANSFER', label: 'Chuyển kho', color: 'purple' },
  { key: 'PRODUCTION', label: 'Sản xuất', color: 'orange' },
  { key: 'DAMAGE', label: 'Hư hỏng', color: 'red' },
  { key: 'RETURN', label: 'Trả hàng', color: 'volcano' },
];

