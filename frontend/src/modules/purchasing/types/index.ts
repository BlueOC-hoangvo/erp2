// Supplier Types
export interface SupplierEntity {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxCode: string;
  bankAccount: string;
  paymentTerms: number; // days
  creditLimit: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

// Purchase Order Types
export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  status: 'PENDING' | 'PARTIAL' | 'COMPLETED';
}

export interface PurchaseOrderEntity {
  id: string;
  orderNo: string;
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  orderDate: string;
  expectedDate: string;
  receivedDate?: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: string;
  exchangeRate: number;
  notes: string;
  items: PurchaseOrderItem[];
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Goods Receipt Types
export interface GoodsReceiptItem {
  id: string;
  purchaseOrderItemId: string;
  productId: string;
  productCode: string;
  productName: string;
  receivedQuantity: number;
  unitPrice: number;
  totalPrice: number;
  warehouseId: string;
  warehouseName: string;
  location: string;
  batchNumber?: string;
  expiryDate?: string;
  qualityStatus: 'PASSED' | 'FAILED' | 'PENDING';
  notes: string;
}

export interface GoodsReceiptEntity {
  id: string;
  receiptNo: string;
  purchaseOrderId: string;
  purchaseOrderNo: string;
  supplierId: string;
  supplierName: string;
  receiptDate: string;
  status: 'DRAFT' | 'CONFIRMED' | 'COMPLETED';
  totalAmount: number;
  currency: string;
  notes: string;
  items: GoodsReceiptItem[];
  receivedBy: string;
  createdAt: string;
  updatedAt: string;
}

// Constants
export const PURCHASE_ORDER_STATUSES = [
  { key: 'DRAFT', label: 'Nháp', color: 'default' },
  { key: 'PENDING', label: 'Chờ duyệt', color: 'orange' },
  { key: 'APPROVED', label: 'Đã duyệt', color: 'blue' },
  { key: 'RECEIVED', label: 'Đã nhận hàng', color: 'green' },
  { key: 'CANCELLED', label: 'Hủy', color: 'red' }
] as const;

export const GOODS_RECEIPT_STATUSES = [
  { key: 'DRAFT', label: 'Nháp', color: 'default' },
  { key: 'CONFIRMED', label: 'Đã xác nhận', color: 'blue' },
  { key: 'COMPLETED', label: 'Hoàn thành', color: 'green' }
] as const;

export const SUPPLIER_STATUSES = [
  { key: 'ACTIVE', label: 'Hoạt động', color: 'green' },
  { key: 'INACTIVE', label: 'Ngừng hoạt động', color: 'red' }
] as const;
