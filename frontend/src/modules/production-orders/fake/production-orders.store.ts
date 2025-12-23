const uid = (prefix = "po") => `${prefix}_${Math.random().toString(16).slice(2)}_${Math.random().toString(16).slice(2)}`;

import type { 
  ProductionOrderEntity, 
  ProductionOrderItem, 
  ProductionOrderMaterial, 
  QualityCheck 
} from '../types';

// Sample Production Orders Data
const sampleOrders: ProductionOrderEntity[] = [
  {
    id: uid("po"),
    orderNo: "PO-2024-001",
    planId: "pp_001",
    productStyleId: "STYLE_001",
    productStyleCode: "TSH001",
    productName: "Áo thun basic cotton",
    customerName: "ABC Fashion",
    totalQuantity: 1000,
    completedQuantity: 650,
    status: "IN_PROGRESS",
    priority: "HIGH",
    startDate: "2024-01-20",
    endDate: "2024-01-25",
    estimatedHours: 40,
    actualHours: 26,
    assignedTeam: "Đội may A",
    workCenters: ["WC_CUTTING", "WC_SEWING", "WC_QC"],
    items: [
      {
        id: uid("poi"),
        sizeCode: "M",
        colorCode: "BLACK",
        plannedQty: 300,
        completedQty: 200,
        status: "IN_PROGRESS",
        workCenter: "WC_SEWING",
        assignedWorker: "Anh Minh",
        startTime: "2024-01-20T08:00:00Z",
        endTime: "2024-01-24T17:00:00Z"
      },
      {
        id: uid("poi"),
        sizeCode: "L",
        colorCode: "WHITE", 
        plannedQty: 400,
        completedQty: 250,
        status: "IN_PROGRESS",
        workCenter: "WC_SEWING",
        assignedWorker: "Chị Lan",
        startTime: "2024-01-21T08:00:00Z"
      },
      {
        id: uid("poi"),
        sizeCode: "XL",
        colorCode: "NAVY",
        plannedQty: 300,
        completedQty: 200,
        status: "COMPLETED",
        workCenter: "WC_SEWING",
        assignedWorker: "Anh Tuấn",
        startTime: "2024-01-20T08:00:00Z",
        endTime: "2024-01-23T17:00:00Z"
      }
    ],
    materials: [
      {
        id: uid("pom"),
        materialCode: "FABRIC_COTTON",
        materialName: "Vải cotton 100%",
        requiredQty: 500,
        consumedQty: 325,
        unit: "m",
        status: "PARTIAL"
      },
      {
        id: uid("pom"),
        materialCode: "THREAD_COTTON",
        materialName: "Chỉ cotton",
        requiredQty: 20,
        consumedQty: 13,
        unit: "kg",
        status: "PARTIAL"
      }
    ],
    qualityChecks: [
      {
        id: uid("poqc"),
        checkPoint: "Kiểm tra đường may",
        result: "PASS",
        checkedBy: "Anh QC 1",
        checkedAt: "2024-01-24T14:30:00Z",
        notes: "Đường may đều, không lỗi"
      },
      {
        id: uid("poqc"),
        checkPoint: "Kiểm tra kích thước",
        result: "PASS",
        checkedBy: "Anh QC 2",
        checkedAt: "2024-01-24T15:00:00Z"
      }
    ],
    notes: "Đơn hàng khẩn cấp cho khách VIP",
    createdAt: "2024-01-19T10:00:00Z",
    updatedAt: "2024-01-24T16:00:00Z"
  },
  {
    id: uid("po"),
    orderNo: "PO-2024-002",
    planId: "pp_002",
    productStyleId: "STYLE_002",
    productStyleCode: "POLO002",
    productName: "Áo polo premium",
    customerName: "XYZ Sportswear",
    totalQuantity: 500,
    completedQuantity: 0,
    status: "PENDING",
    priority: "MEDIUM",
    startDate: "2024-01-25",
    endDate: "2024-01-30",
    estimatedHours: 30,
    actualHours: 0,
    assignedTeam: "Đội may B",
    workCenters: ["WC_CUTTING", "WC_SEWING"],
    items: [
      {
        id: uid("poi"),
        sizeCode: "L",
        colorCode: "RED",
        plannedQty: 200,
        completedQty: 0,
        status: "PENDING",
        workCenter: "WC_SEWING"
      },
      {
        id: uid("poi"),
        sizeCode: "XL", 
        colorCode: "BLUE",
        plannedQty: 300,
        completedQty: 0,
        status: "PENDING",
        workCenter: "WC_SEWING"
      }
    ],
    materials: [
      {
        id: uid("pom"),
        materialCode: "FABRIC_POLY",
        materialName: "Vải polyester blend",
        requiredQty: 250,
        consumedQty: 0,
        unit: "m",
        status: "PENDING"
      }
    ],
    qualityChecks: [],
    createdAt: "2024-01-24T09:00:00Z",
    updatedAt: "2024-01-24T09:00:00Z"
  },
  {
    id: uid("po"),
    orderNo: "PO-2024-003",
    planId: "pp_003",
    productStyleId: "STYLE_003",
    productStyleCode: "HOOD003",
    productName: "Áo hoodie",
    customerName: "Streetwear Co",
    totalQuantity: 800,
    completedQuantity: 800,
    status: "COMPLETED",
    priority: "HIGH",
    startDate: "2024-01-15",
    endDate: "2024-01-20",
    estimatedHours: 60,
    actualHours: 58,
    assignedTeam: "Đội hoodie",
    workCenters: ["WC_CUTTING", "WC_SEWING", "WC_FINISHING"],
    items: [
      {
        id: uid("poi"),
        sizeCode: "M",
        colorCode: "BLACK",
        plannedQty: 300,
        completedQty: 300,
        status: "COMPLETED",
        workCenter: "WC_SEWING",
        assignedWorker: "Đội hoodie",
        startTime: "2024-01-15T08:00:00Z",
        endTime: "2024-01-19T17:00:00Z"
      },
      {
        id: uid("poi"),
        sizeCode: "L",
        colorCode: "GRAY",
        plannedQty: 500,
        completedQty: 500,
        status: "COMPLETED",
        workCenter: "WC_SEWING",
        assignedWorker: "Đội hoodie",
        startTime: "2024-01-15T08:00:00Z",
        endTime: "2024-01-19T17:00:00Z"
      }
    ],
    materials: [
      {
        id: uid("pom"),
        materialCode: "FABRIC_FLEECE",
        materialName: "Vải fleece cotton",
        requiredQty: 400,
        consumedQty: 400,
        unit: "m",
        status: "COMPLETED"
      },
      {
        id: uid("pom"),
        materialCode: "ZIPPER_60CM",
        materialName: "Kéo 60cm",
        requiredQty: 800,
        consumedQty: 800,
        unit: "cái",
        status: "COMPLETED"
      }
    ],
    qualityChecks: [
      {
        id: uid("poqc"),
        checkPoint: "Kiểm tra kéo",
        result: "PASS",
        checkedBy: "Anh QC 1",
        checkedAt: "2024-01-20T10:00:00Z"
      },
      {
        id: uid("poqc"),
        checkPoint: "Kiểm tra đường may hoodie",
        result: "PASS",
        checkedBy: "Anh QC 2",
        checkedAt: "2024-01-20T11:00:00Z"
      }
    ],
    notes: "Hoàn thành đúng tiến độ, chất lượng tốt",
    createdAt: "2024-01-12T08:00:00Z",
    updatedAt: "2024-01-20T17:00:00Z"
  }
];

// Storage functions
export function listProductionOrders(): ProductionOrderEntity[] {
  const stored = localStorage.getItem('fake_production_orders_v1');
  if (!stored) {
    localStorage.setItem('fake_production_orders_v1', JSON.stringify(sampleOrders));
    return sampleOrders;
  }
  return JSON.parse(stored);
}

export function getProductionOrder(id: string): ProductionOrderEntity | null {
  const orders = listProductionOrders();
  return orders.find(order => order.id === id) || null;
}

export function createProductionOrder(order: Omit<ProductionOrderEntity, 'id' | 'orderNo' | 'createdAt' | 'updatedAt'>): ProductionOrderEntity {
  const orders = listProductionOrders();
  const newOrder: ProductionOrderEntity = {
    ...order,
    id: uid("po"),
    orderNo: `PO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  orders.unshift(newOrder);
  localStorage.setItem('fake_production_orders_v1', JSON.stringify(orders));
  return newOrder;
}

export function updateProductionOrder(id: string, updates: Partial<ProductionOrderEntity>): ProductionOrderEntity | null {
  const orders = listProductionOrders();
  const index = orders.findIndex(order => order.id === id);
  if (index === -1) return null;
  
  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem('fake_production_orders_v1', JSON.stringify(orders));
  return orders[index];
}

export function deleteProductionOrder(id: string): boolean {
  const orders = listProductionOrders();
  const filteredOrders = orders.filter(order => order.id !== id);
  if (filteredOrders.length === orders.length) return false;
  
  localStorage.setItem('fake_production_orders_v1', JSON.stringify(filteredOrders));
  return true;
}

export function getProductionOrdersByStatus(status: string): ProductionOrderEntity[] {
  const orders = listProductionOrders();
  return orders.filter(order => order.status === status);
}

export function getProductionOrdersByPriority(priority: string): ProductionOrderEntity[] {
  const orders = listProductionOrders();
  return orders.filter(order => order.priority === priority);
}

// Statistics functions
export function getProductionOrderStats() {
  const orders = listProductionOrders();
  
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;
  const inProgressOrders = orders.filter(o => o.status === 'IN_PROGRESS').length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  
  const totalQuantity = orders.reduce((sum, o) => sum + o.totalQuantity, 0);
  const completedQuantity = orders.reduce((sum, o) => sum + o.completedQuantity, 0);
  
  const completionRate = totalQuantity > 0 ? (completedQuantity / totalQuantity) * 100 : 0;
  
  const urgentOrders = orders.filter(o => o.priority === 'URGENT').length;
  
  return {
    totalOrders,
    completedOrders,
    inProgressOrders,
    pendingOrders,
    totalQuantity,
    completedQuantity,
    completionRate: Math.round(completionRate * 100) / 100,
    urgentOrders
  };
}

