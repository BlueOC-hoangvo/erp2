const uid = (prefix = "wo") => `${prefix}_${Math.random().toString(16).slice(2)}_${Math.random().toString(16).slice(2)}`;

import type { 
  WarehouseOutEntity, 
  WarehouseOutItem, 
  WarehouseArea 
} from '../types';

// Sample Warehouse Out Data
const sampleOuts: WarehouseOutEntity[] = [
  {
    id: uid("wo"),
    outNo: "OUT-2024-001",
    outType: "SALE",
    warehouseId: "WH_001",
    warehouseName: "Kho chính",
    customerId: "CUS_001",
    customerName: "Cửa hàng thời trang ABC",
    salesOrderId: "SO-2024-001",
    reference: "Đơn hàng bán lẻ tháng 1",
    totalValue: 25000000,
    status: "COMPLETED",
    outDate: "2024-01-20",
    approvedBy: "Nguyễn Văn A",
    approvedAt: "2024-01-20T09:00:00Z",
    completedBy: "Trần Thị B",
    completedAt: "2024-01-20T15:30:00Z",
    items: [
      {
        id: uid("woi"),
        productId: "PROD_001",
        productCode: "TSH001",
        productName: "Áo thun basic cotton",
        unit: "cái",
        requestedQty: 100,
        outQty: 100,
        unitPrice: 150000,
        totalPrice: 15000000,
        warehouseArea: "Khu A - Kệ 1",
        shelfLocation: "A1-01",
        batchNo: "BATCH001",
        status: "COMPLETED"
      },
      {
        id: uid("woi"),
        productId: "PROD_002", 
        productCode: "POLO002",
        productName: "Áo polo premium",
        unit: "cái",
        requestedQty: 50,
        outQty: 50,
        unitPrice: 200000,
        totalPrice: 10000000,
        warehouseArea: "Khu B - Kệ 2",
        shelfLocation: "B2-05",
        batchNo: "BATCH002",
        status: "COMPLETED"
      }
    ],
    notes: "Xuất cho đơn hàng bán lẻ tháng 1, khách hàng VIP",
    createdAt: "2024-01-19T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z"
  },
  {
    id: uid("wo"),
    outNo: "OUT-2024-002",
    outType: "PRODUCTION",
    warehouseId: "WH_001",
    warehouseName: "Kho chính",
    productionOrderId: "PO-2024-001",
    reference: "Cấp vật tư cho lệnh sản xuất áo thun",
    totalValue: 8500000,
    status: "APPROVED",
    outDate: "2024-01-24",
    approvedBy: "Nguyễn Văn C",
    approvedAt: "2024-01-24T08:30:00Z",
    items: [
      {
        id: uid("woi"),
        productId: "MAT_001",
        productCode: "FABRIC_COTTON",
        productName: "Vải cotton 100%",
        unit: "m",
        requestedQty: 300,
        outQty: 0,
        unitPrice: 25000,
        totalPrice: 0,
        warehouseArea: "Khu nguyên liệu",
        shelfLocation: "NL-A1",
        batchNo: "FAB202401",
        status: "PENDING"
      },
      {
        id: uid("woi"),
        productId: "MAT_002",
        productCode: "THREAD_COTTON", 
        productName: "Chỉ cotton",
        unit: "kg",
        requestedQty: 10,
        outQty: 0,
        unitPrice: 100000,
        totalPrice: 0,
        warehouseArea: "Khu phụ liệu",
        shelfLocation: "PL-B2",
        batchNo: "THR202401",
        status: "PENDING"
      }
    ],
    notes: "Cấp vật tư cho lệnh sản xuất PO-2024-001",
    createdAt: "2024-01-23T14:00:00Z",
    updatedAt: "2024-01-24T08:30:00Z"
  },
  {
    id: uid("wo"),
    outNo: "OUT-2024-003",
    outType: "TRANSFER",
    warehouseId: "WH_001",
    warehouseName: "Kho chính",
    reference: "Chuyển hàng sang kho phụ",
    totalValue: 3500000,
    status: "PENDING",
    outDate: "2024-01-25",
    items: [
      {
        id: uid("woi"),
        productId: "PROD_003",
        productCode: "HOOD003",
        productName: "Áo hoodie",
        unit: "cái",
        requestedQty: 50,
        outQty: 0,
        unitPrice: 70000,
        totalPrice: 0,
        warehouseArea: "Khu C - Kệ 3",
        shelfLocation: "C3-10",
        status: "PENDING"
      }
    ],
    notes: "Chuyển tồn kho sang kho phụ để giảm tải kho chính",
    createdAt: "2024-01-24T16:00:00Z",
    updatedAt: "2024-01-24T16:00:00Z"
  },
  {
    id: uid("wo"),
    outNo: "OUT-2024-004",
    outType: "DAMAGE",
    warehouseId: "WH_001",
    warehouseName: "Kho chính",
    reference: "Hủy sản phẩm lỗi",
    totalValue: 450000,
    status: "COMPLETED",
    outDate: "2024-01-22",
    approvedBy: "Lê Văn D",
    approvedAt: "2024-01-22T10:00:00Z",
    completedBy: "Phạm Thị E",
    completedAt: "2024-01-22T14:00:00Z",
    items: [
      {
        id: uid("woi"),
        productId: "PROD_004",
        productCode: "TSH002",
        productName: "Áo thun basic (lỗi)",
        unit: "cái",
        requestedQty: 15,
        outQty: 15,
        unitPrice: 30000,
        totalPrice: 450000,
        warehouseArea: "Khu hàng lỗi",
        shelfLocation: "HL-01",
        batchNo: "BATCH003",
        status: "COMPLETED"
      }
    ],
    notes: "Hủy sản phẩm lỗi do lỗi sản xuất, đã được phê duyệt",
    createdAt: "2024-01-22T09:00:00Z",
    updatedAt: "2024-01-22T14:00:00Z"
  }
];

// Sample Warehouse Areas
const sampleAreas: WarehouseArea[] = [
  {
    id: uid("wa"),
    areaCode: "AREA_A1",
    areaName: "Khu A - Thành phẩm",
    warehouseId: "WH_001",
    areaType: "STORAGE",
    capacity: 1000,
    currentLoad: 650,
    temperature: "20-25°C",
    humidity: "50-60%",
    isActive: true,
    createdAt: "2024-01-01T08:00:00Z"
  },
  {
    id: uid("wa"),
    areaCode: "AREA_B1", 
    areaName: "Khu B - Nguyên liệu",
    warehouseId: "WH_001",
    areaType: "STORAGE",
    capacity: 800,
    currentLoad: 520,
    temperature: "18-22°C",
    humidity: "45-55%",
    isActive: true,
    createdAt: "2024-01-01T08:00:00Z"
  },
  {
    id: uid("wa"),
    areaCode: "AREA_P1",
    areaName: "Khu đóng gói",
    warehouseId: "WH_001",
    areaType: "SHIPPING",
    capacity: 200,
    currentLoad: 45,
    isActive: true,
    createdAt: "2024-01-01T08:00:00Z"
  }
];

// Storage functions
export function listWarehouseOuts(): WarehouseOutEntity[] {
  const stored = localStorage.getItem('fake_warehouse_outs_v1');
  if (!stored) {
    localStorage.setItem('fake_warehouse_outs_v1', JSON.stringify(sampleOuts));
    return sampleOuts;
  }
  return JSON.parse(stored);
}

export function getWarehouseOut(id: string): WarehouseOutEntity | null {
  const outs = listWarehouseOuts();
  return outs.find(out => out.id === id) || null;
}

export function createWarehouseOut(out: Omit<WarehouseOutEntity, 'id' | 'outNo' | 'createdAt' | 'updatedAt'>): WarehouseOutEntity {
  const outs = listWarehouseOuts();
  const newOut: WarehouseOutEntity = {
    ...out,
    id: uid("wo"),
    outNo: `OUT-${new Date().getFullYear()}-${String(outs.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  outs.unshift(newOut);
  localStorage.setItem('fake_warehouse_outs_v1', JSON.stringify(outs));
  return newOut;
}

export function updateWarehouseOut(id: string, updates: Partial<WarehouseOutEntity>): WarehouseOutEntity | null {
  const outs = listWarehouseOuts();
  const index = outs.findIndex(out => out.id === id);
  if (index === -1) return null;
  
  outs[index] = {
    ...outs[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem('fake_warehouse_outs_v1', JSON.stringify(outs));
  return outs[index];
}

export function deleteWarehouseOut(id: string): boolean {
  const outs = listWarehouseOuts();
  const filteredOuts = outs.filter(out => out.id !== id);
  if (filteredOuts.length === outs.length) return false;
  
  localStorage.setItem('fake_warehouse_outs_v1', JSON.stringify(filteredOuts));
  return true;
}

export function getWarehouseOutsByStatus(status: string): WarehouseOutEntity[] {
  const outs = listWarehouseOuts();
  return outs.filter(out => out.status === status);
}

export function getWarehouseOutsByType(type: string): WarehouseOutEntity[] {
  const outs = listWarehouseOuts();
  return outs.filter(out => out.outType === type);
}

// Warehouse Areas functions
export function listWarehouseAreas(): WarehouseArea[] {
  const stored = localStorage.getItem('fake_warehouse_areas_v1');
  if (!stored) {
    localStorage.setItem('fake_warehouse_areas_v1', JSON.stringify(sampleAreas));
    return sampleAreas;
  }
  return JSON.parse(stored);
}

// Statistics functions
export function getWarehouseOutStats() {
  const outs = listWarehouseOuts();
  
  const totalOuts = outs.length;
  const completedOuts = outs.filter(o => o.status === 'COMPLETED').length;
  const pendingOuts = outs.filter(o => o.status === 'PENDING').length;
  const approvedOuts = outs.filter(o => o.status === 'APPROVED').length;
  
  const totalValue = outs.reduce((sum, o) => sum + o.totalValue, 0);
  const completedValue = outs.filter(o => o.status === 'COMPLETED').reduce((sum, o) => sum + o.totalValue, 0);
  
  const outTypes = outs.reduce((acc, out) => {
    acc[out.outType] = (acc[out.outType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const todayOuts = outs.filter(o => {
    const outDate = new Date(o.outDate);
    const today = new Date();
    return outDate.toDateString() === today.toDateString();
  }).length;
  
  return {
    totalOuts,
    completedOuts,
    pendingOuts,
    approvedOuts,
    totalValue,
    completedValue,
    outTypes,
    todayOuts,
    completionRate: totalOuts > 0 ? Math.round((completedOuts / totalOuts) * 100) : 0
  };
}

