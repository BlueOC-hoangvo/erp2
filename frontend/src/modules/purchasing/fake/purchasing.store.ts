const uid = (prefix = "p") => `${prefix}_${Math.random().toString(16).slice(2)}_${Math.random().toString(16).slice(2)}`;

import type { 
  SupplierEntity, 
  PurchaseOrderEntity, 
  PurchaseOrderItem,
  GoodsReceiptEntity,
  GoodsReceiptItem
} from '../types';

// Sample Suppliers Data
const sampleSuppliers: SupplierEntity[] = [
  {
    id: uid("sup"),
    code: "SUP001",
    name: "Công ty TNHH Vải Sợi Việt Nam",
    contactPerson: "Nguyễn Văn An",
    email: "an.nguyen@vaisoi.vn",
    phone: "0912345678",
    address: "123 Đường Nguyễn Văn Cừ, Quận 1, TP.HCM",
    taxCode: "0123456789",
    bankAccount: "1234567890",
    paymentTerms: 30,
    creditLimit: 100000000,
    status: "ACTIVE",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T08:00:00Z"
  },
  {
    id: uid("sup"),
    code: "SUP002",
    name: "Công ty Cổ phần May mặc Bình Minh",
    contactPerson: "Trần Thị Lan",
    email: "lan.tran@maybinhminh.com",
    phone: "0987654321",
    address: "456 Đường Lê Lợi, Quận 3, TP.HCM",
    taxCode: "9876543210",
    bankAccount: "0987654321",
    paymentTerms: 15,
    creditLimit: 50000000,
    status: "ACTIVE",
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-16T09:00:00Z"
  },
  {
    id: uid("sup"),
    code: "SUP003",
    name: "Nhà máy Dệt Kim Đại Thắng",
    contactPerson: "Lê Văn Tuấn",
    email: "tuan.le@daihang.com",
    phone: "0123456789",
    address: "789 Đường Cách Mạng Tháng 8, Quận Tân Bình, TP.HCM",
    taxCode: "1122334455",
    bankAccount: "1122334455",
    paymentTerms: 45,
    creditLimit: 200000000,
    status: "ACTIVE",
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-01-17T10:00:00Z"
  }
];

// Sample Purchase Orders Data
const samplePurchaseOrders: PurchaseOrderEntity[] = [
  {
    id: uid("po"),
    orderNo: "PO-2024-001",
    supplierId: "sup_001",
    supplierName: "Công ty TNHH Vải Sợi Việt Nam",
    supplierCode: "SUP001",
    orderDate: "2024-01-20",
    expectedDate: "2024-02-20",
    status: "PENDING",
    totalAmount: 50000000,
    paidAmount: 0,
    remainingAmount: 50000000,
    currency: "VND",
    exchangeRate: 1,
    notes: "Đơn hàng vải cotton cho sản xuất áo thun",
    items: [
      {
        id: uid("poi"),
        productId: "prod_001",
        productCode: "FABRIC_COTTON",
        productName: "Vải cotton 100%",
        quantity: 1000,
        unitPrice: 50000,
        totalPrice: 50000000,
        receivedQuantity: 0,
        status: "PENDING"
      }
    ],
    approvalStatus: "PENDING",
    createdBy: "admin",
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z"
  },
  {
    id: uid("po"),
    orderNo: "PO-2024-002",
    supplierId: "sup_002",
    supplierName: "Công ty Cổ phần May mặc Bình Minh",
    supplierCode: "SUP002",
    orderDate: "2024-01-22",
    expectedDate: "2024-02-06",
    status: "APPROVED",
    totalAmount: 25000000,
    paidAmount: 0,
    remainingAmount: 25000000,
    currency: "VND",
    exchangeRate: 1,
    notes: "Mua chỉ cotton và phụ kiện may mặc",
    items: [
      {
        id: uid("poi"),
        productId: "prod_002",
        productCode: "THREAD_COTTON",
        productName: "Chỉ cotton",
        quantity: 500,
        unitPrice: 30000,
        totalPrice: 15000000,
        receivedQuantity: 300,
        status: "PARTIAL"
      },
      {
        id: uid("poi"),
        productId: "prod_003",
        productCode: "BUTTON",
        productName: "Nút áo",
        quantity: 2000,
        unitPrice: 5000,
        totalPrice: 10000000,
        receivedQuantity: 0,
        status: "PENDING"
      }
    ],
    approvalStatus: "APPROVED",
    approvedBy: "manager",
    approvedAt: "2024-01-22T14:00:00Z",
    createdBy: "buyer",
    createdAt: "2024-01-22T09:00:00Z",
    updatedAt: "2024-01-22T14:00:00Z"
  }
];

// Sample Goods Receipts Data
const sampleGoodsReceipts: GoodsReceiptEntity[] = [
  {
    id: uid("gr"),
    receiptNo: "GR-2024-001",
    purchaseOrderId: "po_002",
    purchaseOrderNo: "PO-2024-002",
    supplierId: "sup_002",
    supplierName: "Công ty Cổ phần May mặc Bình Minh",
    receiptDate: "2024-01-25",
    status: "COMPLETED",
    totalAmount: 9000000,
    currency: "VND",
    notes: "Nhận một phần chỉ cotton từ đơn PO-2024-002",
    items: [
      {
        id: uid("gri"),
        purchaseOrderItemId: "poi_002",
        productId: "prod_002",
        productCode: "THREAD_COTTON",
        productName: "Chỉ cotton",
        receivedQuantity: 300,
        unitPrice: 30000,
        totalPrice: 9000000,
        warehouseId: "wh_001",
        warehouseName: "Kho nguyên liệu chính",
        location: "A1-01-01",
        qualityStatus: "PASSED",
        notes: "Chất lượng tốt, đúng quy cách"
      }
    ],
    receivedBy: "warehouse_staff",
    createdAt: "2024-01-25T10:00:00Z",
    updatedAt: "2024-01-25T10:00:00Z"
  }
];

// Supplier functions
export function listSuppliers(): SupplierEntity[] {
  const stored = localStorage.getItem('fake_suppliers_v1');
  if (!stored) {
    localStorage.setItem('fake_suppliers_v1', JSON.stringify(sampleSuppliers));
    return sampleSuppliers;
  }
  return JSON.parse(stored);
}

export function getSupplier(id: string): SupplierEntity | null {
  const suppliers = listSuppliers();
  return suppliers.find(supplier => supplier.id === id) || null;
}

export function createSupplier(supplier: Omit<SupplierEntity, 'id' | 'createdAt' | 'updatedAt'>): SupplierEntity {
  const suppliers = listSuppliers();
  const newSupplier: SupplierEntity = {
    ...supplier,
    id: uid("sup"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  suppliers.unshift(newSupplier);
  localStorage.setItem('fake_suppliers_v1', JSON.stringify(suppliers));
  return newSupplier;
}

export function updateSupplier(id: string, updates: Partial<SupplierEntity>): SupplierEntity | null {
  const suppliers = listSuppliers();
  const index = suppliers.findIndex(supplier => supplier.id === id);
  if (index === -1) return null;
  
  suppliers[index] = {
    ...suppliers[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem('fake_suppliers_v1', JSON.stringify(suppliers));
  return suppliers[index];
}

export function deleteSupplier(id: string): boolean {
  const suppliers = listSuppliers();
  const filteredSuppliers = suppliers.filter(supplier => supplier.id !== id);
  if (filteredSuppliers.length === suppliers.length) return false;
  
  localStorage.setItem('fake_suppliers_v1', JSON.stringify(filteredSuppliers));
  return true;
}

// Purchase Order functions
export function listPurchaseOrders(): PurchaseOrderEntity[] {
  const stored = localStorage.getItem('fake_purchase_orders_v1');
  if (!stored) {
    localStorage.setItem('fake_purchase_orders_v1', JSON.stringify(samplePurchaseOrders));
    return samplePurchaseOrders;
  }
  return JSON.parse(stored);
}

export function getPurchaseOrder(id: string): PurchaseOrderEntity | null {
  const orders = listPurchaseOrders();
  return orders.find(order => order.id === id) || null;
}

export function createPurchaseOrder(order: Omit<PurchaseOrderEntity, 'id' | 'orderNo' | 'createdAt' | 'updatedAt'>): PurchaseOrderEntity {
  const orders = listPurchaseOrders();
  const newOrder: PurchaseOrderEntity = {
    ...order,
    id: uid("po"),
    orderNo: `PO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  orders.unshift(newOrder);
  localStorage.setItem('fake_purchase_orders_v1', JSON.stringify(orders));
  return newOrder;
}

export function updatePurchaseOrder(id: string, updates: Partial<PurchaseOrderEntity>): PurchaseOrderEntity | null {
  const orders = listPurchaseOrders();
  const index = orders.findIndex(order => order.id === id);
  if (index === -1) return null;
  
  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem('fake_purchase_orders_v1', JSON.stringify(orders));
  return orders[index];
}

export function deletePurchaseOrder(id: string): boolean {
  const orders = listPurchaseOrders();
  const filteredOrders = orders.filter(order => order.id !== id);
  if (filteredOrders.length === orders.length) return false;
  
  localStorage.setItem('fake_purchase_orders_v1', JSON.stringify(filteredOrders));
  return true;
}

// Goods Receipt functions
export function listGoodsReceipts(): GoodsReceiptEntity[] {
  const stored = localStorage.getItem('fake_goods_receipts_v1');
  if (!stored) {
    localStorage.setItem('fake_goods_receipts_v1', JSON.stringify(sampleGoodsReceipts));
    return sampleGoodsReceipts;
  }
  return JSON.parse(stored);
}

export function getGoodsReceipt(id: string): GoodsReceiptEntity | null {
  const receipts = listGoodsReceipts();
  return receipts.find(receipt => receipt.id === id) || null;
}

export function createGoodsReceipt(receipt: Omit<GoodsReceiptEntity, 'id' | 'receiptNo' | 'createdAt' | 'updatedAt'>): GoodsReceiptEntity {
  const receipts = listGoodsReceipts();
  const newReceipt: GoodsReceiptEntity = {
    ...receipt,
    id: uid("gr"),
    receiptNo: `GR-${new Date().getFullYear()}-${String(receipts.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  receipts.unshift(newReceipt);
  localStorage.setItem('fake_goods_receipts_v1', JSON.stringify(receipts));
  return newReceipt;
}

// Statistics functions
export function getPurchasingStats() {
  const suppliers = listSuppliers();
  const orders = listPurchaseOrders();
  const receipts = listGoodsReceipts();
  
  const totalSuppliers = suppliers.filter(s => s.status === 'ACTIVE').length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const approvedOrders = orders.filter(o => o.status === 'APPROVED').length;
  const receivedOrders = orders.filter(o => o.status === 'RECEIVED').length;
  const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;
  
  const totalOrderValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const paidAmount = orders.reduce((sum, o) => sum + o.paidAmount, 0);
  const outstandingAmount = totalOrderValue - paidAmount;
  
  // Tính tỷ lệ giao hàng đúng hạn
  const onTimeDeliveries = receipts.filter(r => {
    const order = orders.find(o => o.id === r.purchaseOrderId);
    return order && new Date(r.receiptDate) <= new Date(order.expectedDate);
  }).length;
  const totalDeliveries = receipts.length;
  const onTimeRate = totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0;
  
  // Dữ liệu cho biểu đồ theo tháng
  const monthlyData = [
    { month: 'Tháng 1', value: 1200000000, orders: 12 },
    { month: 'Tháng 2', value: 1450000000, orders: 15 },
    { month: 'Tháng 3', value: 980000000, orders: 8 },
    { month: 'Tháng 4', value: 1670000000, orders: 18 },
    { month: 'Tháng 5', value: 1890000000, orders: 22 },
    { month: 'Tháng 6', value: 2100000000, orders: 25 },
  ];
  
  // Top nhà cung cấp theo giá trị
  const supplierStats = suppliers.map(supplier => {
    const supplierOrders = orders.filter(o => o.supplierId === supplier.id);
    const totalValue = supplierOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    return {
      ...supplier,
      totalOrders: supplierOrders.length,
      totalValue,
      avgOrderValue: supplierOrders.length > 0 ? totalValue / supplierOrders.length : 0
    };
  }).sort((a, b) => b.totalValue - a.totalValue);
  
  return {
    totalSuppliers,
    totalOrders,
    pendingOrders,
    approvedOrders,
    receivedOrders,
    cancelledOrders,
    totalOrderValue,
    paidAmount,
    outstandingAmount,
    avgOrderValue: totalOrders > 0 ? totalOrderValue / totalOrders : 0,
    onTimeRate: Math.round(onTimeRate * 10) / 10,
    monthlyData,
    topSuppliers: supplierStats.slice(0, 5),
    orderStatusDistribution: {
      PENDING: pendingOrders,
      APPROVED: approvedOrders,
      RECEIVED: receivedOrders,
      CANCELLED: cancelledOrders
    }
  };
}
