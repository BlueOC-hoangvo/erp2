export interface WarehouseInEntity {
  id: string;
  inNo: string;
  inType: 'PURCHASE' | 'PRODUCTION_RETURN' | 'TRANSFER_IN' | 'ADJUSTMENT' | 'SAMPLE';
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
  supplierName?: string;
  referenceNo?: string;
  inDate: string;
  expectedDate?: string;
  completedDate?: string;
  notes?: string;
  totalAmount: number;
  currency: string;
  exchangeRate: number;
  warehouse: string;
  area: string;
  items: WarehouseInItem[];
  attachments: string[];
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseInItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  lotNumber?: string;
  expiryDate?: string;
  quality: 'A' | 'B' | 'C' | 'REJECT';
  location: string;
  notes?: string;
}

export interface WarehouseTransferEntity {
  id: string;
  transferNo: string;
  fromWarehouse: string;
  toWarehouse: string;
  transferDate: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'TRANSFERRED' | 'CANCELLED';
  items: WarehouseTransferItem[];
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseTransferItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  unit: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
}

export const WAREHOUSE_IN_TYPES = {
  PURCHASE: { label: 'Mua hàng', color: 'blue' },
  PRODUCTION_RETURN: { label: 'Trả từ sản xuất', color: 'green' },
  TRANSFER_IN: { label: 'Chuyển vào', color: 'orange' },
  ADJUSTMENT: { label: 'Điều chỉnh', color: 'purple' },
  SAMPLE: { label: 'Mẫu', color: 'cyan' }
} as const;

export const WAREHOUSE_IN_STATUS = {
  DRAFT: { label: 'Nháp', color: 'default' },
  SUBMITTED: { label: 'Đã trình', color: 'blue' },
  APPROVED: { label: 'Đã phê duyệt', color: 'green' },
  RECEIVED: { label: 'Đã nhận', color: 'purple' },
  CANCELLED: { label: 'Đã hủy', color: 'red' }
} as const;

