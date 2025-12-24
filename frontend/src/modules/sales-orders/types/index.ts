// Sales Orders Types - Backend Aligned

export type SalesOrderStatus = 
  | 'DRAFT'
  | 'CONFIRMED'
  | 'IN_PRODUCTION'
  | 'DONE'
  | 'CANCELLED';

export type SalesOrderBreakdown = {
  id: string;
  productVariantId: string;
  qty: string; // decimal string từ backend
  productVariant?: {
    id: string;
    name: string;
    sku?: string;
  };
};

export type SalesOrderItem = {
  id: string;
  lineNo: number;
  productStyleId: string;
  itemName: string;
  uom: string;
  qtyTotal: string; // decimal string từ backend
  unitPrice: string; // decimal string từ backend
  totalAmount: string; // calculated từ backend
  note?: string;
  breakdowns: SalesOrderBreakdown[];
  productStyle?: {
    id: string;
    name: string;
    code: string;
  };
};

export type SalesOrder = {
  id: string;
  orderNo: string;
  customerId: string;
  customer?: {
    id: string;
    name: string;
    code?: string;
  };
  orderDate: string;
  dueDate?: string;
  status: SalesOrderStatus;
  note?: string;
  isInternal: boolean;
  totalAmount: string; // decimal string từ backend
  items: SalesOrderItem[];
  createdAt: string;
  updatedAt: string;
};

// API Request/Response Types - Backend Aligned
export type CreateSalesOrderRequest = {
  orderNo: string;
  customerId: string;
  orderDate?: string;
  dueDate?: string;
  status?: SalesOrderStatus;
  note?: string;
  isInternal?: boolean;
  items: Array<{
    lineNo: number;
    productStyleId: string;
    itemName: string;
    uom?: string;
    qtyTotal: string;
    unitPrice: string;
    note?: string;
    breakdowns?: Array<{
      productVariantId: string;
      qty: string;
    }>;
  }>;
};

export type UpdateSalesOrderRequest = Partial<CreateSalesOrderRequest> & {
  customerId?: string;
  items?: Array<{
    lineNo: number;
    productStyleId: string;
    itemName: string;
    uom?: string;
    qtyTotal: string;
    unitPrice: string;
    note?: string;
    breakdowns?: Array<{
      productVariantId: string;
      qty: string;
    }>;
  }>;
};

export type SalesOrderQuery = {
  q?: string;
  customerId?: string;
  status?: SalesOrderStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "orderDate" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
};

export type SalesOrderResponse = {
  data: SalesOrder[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Form Types
export type SalesOrderFormData = {
  orderNo: string;
  customerId: string;
  orderDate?: string;
  dueDate?: string;
  note?: string;
  isInternal?: boolean;
  items: Array<{
    lineNo: number;
    productStyleId: string;
    itemName: string;
    uom?: string;
    qtyTotal: string;
    unitPrice: string;
    note?: string;
    breakdowns?: Array<{
      productVariantId: string;
      qty: string;
    }>;
  }>;
};

// UI Helper Types
export type SalesOrderTableRow = {
  key: string;
  orderNo: string;
  customerName: string;
  orderDate: string;
  dueDate?: string;
  status: SalesOrderStatus;
  totalAmount: string;
  actions: string;
};

// Status colors for UI
export const SALES_ORDER_STATUS_COLORS: Record<SalesOrderStatus, string> = {
  DRAFT: 'default',
  CONFIRMED: 'blue',
  IN_PRODUCTION: 'orange',
  DONE: 'green',
  CANCELLED: 'red',
};

// Status labels in Vietnamese
export const SALES_ORDER_STATUS_LABELS: Record<SalesOrderStatus, string> = {
  DRAFT: 'Nháp',
  CONFIRMED: 'Đã xác nhận',
  IN_PRODUCTION: 'Đang sản xuất',
  DONE: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};
