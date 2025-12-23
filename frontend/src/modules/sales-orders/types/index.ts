// Sales Orders Types

export type SalesOrderStatus = 
  | 'draft'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'completed';

export type SalesOrderType = 
  | 'sale'
  | 'purchase'
  | 'return'
  | 'exchange';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'partial'
  | 'refunded';

export type SalesOrderItem = {
  id: string;
  productId: string;
  productName?: string;
  productSku?: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type SalesOrder = {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  orderType: SalesOrderType;
  status: SalesOrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  currency: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  discountPercent: number;
  taxEnabled: boolean;
  taxPercent: number;
  notes?: string;
  shippingAddress?: string;
  billingAddress?: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  createdBy: string;
  updatedBy?: string;
  items: SalesOrderItem[];
  statusHistory?: SalesOrderStatusHistory[];
};

export type SalesOrderStatusHistory = {
  id: string;
  salesOrderId: string;
  fromStatus?: SalesOrderStatus;
  toStatus: SalesOrderStatus;
  changedBy: string;
  changedByName?: string;
  reason?: string;
  metadata?: Record<string, any>;
  createdAt: string;
};

export type WorkOrder = {
  id: string;
  workOrderNumber: string;
  salesOrderId: string;
  customerId: string;
  customerName?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  assignedToName?: string;
  estimatedHours?: number;
  actualHours: number;
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  createdBy: string;
};

// API Request/Response Types
export type CreateSalesOrderRequest = {
  customerId: string;
  orderType: SalesOrderType;
  paymentMethod: string;
  currency: string;
  items: {
    productId: string;
    qty: number;
    unitPrice: number;
    discountPercent?: number;
    taxPercent?: number;
    note?: string;
  }[];
  shippingFee?: number;
  discountAmount?: number;
  discountPercent?: number;
  taxEnabled?: boolean;
  taxPercent?: number;
  notes?: string;
  shippingAddress?: string;
  billingAddress?: string;
  expectedDeliveryDate?: string;
};

export type UpdateSalesOrderRequest = {
  customerId?: string;
  orderType?: SalesOrderType;
  paymentMethod?: string;
  currency?: string;
  shippingFee?: number;
  discountAmount?: number;
  discountPercent?: number;
  taxEnabled?: boolean;
  taxPercent?: number;
  notes?: string;
  shippingAddress?: string;
  billingAddress?: string;
  expectedDeliveryDate?: string;
};

export type UpdateSalesOrderStatusRequest = {
  status: SalesOrderStatus;
  reason?: string;
  metadata?: Record<string, any>;
};

export type ConvertToWorkOrderRequest = {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedHours?: number;
  dueDate?: string;
};

export type SalesOrderStats = {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<SalesOrderStatus, number>;
  ordersByType: Record<SalesOrderType, number>;
  recentOrders: SalesOrder[];
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    orderCount: number;
    totalRevenue: number;
  }>;
};

// Form Types
export type SalesOrderFormData = {
  customerId: string;
  orderType: SalesOrderType;
  paymentMethod: string;
  currency: string;
  items: Array<{
    productId: string;
    qty: number;
    unitPrice: number;
    discountPercent?: number;
    taxPercent?: number;
    note?: string;
  }>;
  shippingFee: number;
  discountAmount: number;
  discountPercent: number;
  taxEnabled: boolean;
  taxPercent: number;
  notes: string;
  shippingAddress: string;
  billingAddress: string;
  expectedDeliveryDate: string;
};

// Filter and Search Types
export type SalesOrderFilters = {
  status?: SalesOrderStatus[];
  orderType?: SalesOrderType[];
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'orderNumber' | 'totalAmount';
  sortOrder?: 'asc' | 'desc';
};
