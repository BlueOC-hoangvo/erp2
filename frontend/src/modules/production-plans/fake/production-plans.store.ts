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

const uid = (prefix = "pp") => `${prefix}_${Math.random().toString(16).slice(2)}_${Math.random().toString(16).slice(2)}`;

const sampleData: ProductionPlanEntity[] = [
  {
    id: uid("pp"),
    planNo: "PP-2024-001",
    planName: "Kế hoạch sản xuất áo thun Q1/2024",
    description: "Sản xuất áo thun basic cho khách hàng ABC Company",
    startDate: "2024-01-15",
    endDate: "2024-01-25",
    status: "IN_PROGRESS",
    totalQuantity: 5000,
    completedQuantity: 3200,
    priority: "HIGH",
    customerName: "ABC Company",
    salesOrderId: "so_123456",
    items: [
      {
        id: uid("ppi"),
        productStyleId: "STYLE_001",
        productStyleCode: "TSH001",
        productName: "Áo thun basic",
        plannedQuantity: 3000,
        actualQuantity: 2000,
        unit: "pcs",
        status: "IN_PROGRESS",
        workCenter: "WC_CUTTING",
        estimatedHours: 40,
        actualHours: 28,
        breakdowns: [
          {
            id: uid("ppb"),
            sizeCode: "M",
            colorCode: "BLACK",
            plannedQty: 1000,
            actualQty: 700,
            workStation: "WS_CUTTING_01"
          },
          {
            id: uid("ppb"),
            sizeCode: "L", 
            colorCode: "WHITE",
            plannedQty: 1000,
            actualQty: 650,
            workStation: "WS_CUTTING_02"
          }
        ]
      },
      {
        id: uid("ppi"),
        productStyleId: "STYLE_002",
        productStyleCode: "POLO002",
        productName: "Áo polo",
        plannedQuantity: 2000,
        actualQuantity: 1200,
        unit: "pcs",
        status: "IN_PROGRESS",
        workCenter: "WC_SEWING",
        estimatedHours: 60,
        actualHours: 35,
        breakdowns: [
          {
            id: uid("ppb"),
            sizeCode: "M",
            colorCode: "BLUE",
            plannedQty: 800,
            actualQty: 500,
            workStation: "WS_SEWING_01"
          }
        ]
      }
    ],
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z"
  },
  {
    id: uid("pp"),
    planNo: "PP-2024-002", 
    planName: "Kế hoạch sản xuất hoodie Q1/2024",
    description: "Sản xuất áo hoodie cho đơn hàng XYX",
    startDate: "2024-01-20",
    endDate: "2024-01-30",
    status: "PLANNED",
    totalQuantity: 1500,
    completedQuantity: 0,
    priority: "MEDIUM",
    customerName: "XYZ Trading",
    salesOrderId: "so_789012",
    items: [
      {
        id: uid("ppi"),
        productStyleId: "STYLE_003",
        productStyleCode: "HOOD003",
        productName: "Áo hoodie",
        plannedQuantity: 1500,
        actualQuantity: 0,
        unit: "pcs",
        status: "PENDING",
        workCenter: "WC_SEWING",
        estimatedHours: 80,
        actualHours: 0,
        breakdowns: [
          {
            id: uid("ppb"),
            sizeCode: "L",
            colorCode: "GRAY",
            plannedQty: 800,
            actualQty: 0,
            workStation: "WS_SEWING_03"
          },
          {
            id: uid("ppb"),
            sizeCode: "XL",
            colorCode: "BLACK",
            plannedQty: 700,
            actualQty: 0,
            workStation: "WS_SEWING_04"
          }
        ]
      }
    ],
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z"
  },
  {
    id: uid("pp"),
    planNo: "PP-2024-003",
    planName: "Kế hoạch sản xuất áo dài tay",
    description: "Sản xuất áo dài tay theo đơn hàng đặc biệt",
    startDate: "2024-01-05",
    endDate: "2024-01-15",
    status: "COMPLETED",
    totalQuantity: 800,
    completedQuantity: 800,
    priority: "URGENT",
    customerName: "Special Customer",
    salesOrderId: "so_345678",
    items: [
      {
        id: uid("ppi"),
        productStyleId: "STYLE_005",
        productStyleCode: "LONG005",
        productName: "Áo dài tay",
        plannedQuantity: 800,
        actualQuantity: 800,
        unit: "pcs",
        status: "COMPLETED",
        workCenter: "WC_SEWING",
        estimatedHours: 50,
        actualHours: 48,
        breakdowns: [
          {
            id: uid("ppb"),
            sizeCode: "M",
            colorCode: "RED",
            plannedQty: 400,
            actualQty: 400,
            workStation: "WS_SEWING_05"
          },
          {
            id: uid("ppb"),
            sizeCode: "L",
            colorCode: "BLUE", 
            plannedQty: 400,
            actualQty: 400,
            workStation: "WS_SEWING_06"
          }
        ]
      }
    ],
    createdAt: "2024-01-01T09:00:00Z",
    updatedAt: "2024-01-15T16:00:00Z"
  }
];

export function listProductionPlans(): ProductionPlanEntity[] {
  const stored = localStorage.getItem('fake_production_plans_v1');
  if (!stored) {
    localStorage.setItem('fake_production_plans_v1', JSON.stringify(sampleData));
    return sampleData;
  }
  return JSON.parse(stored);
}

export function getProductionPlan(id: string): ProductionPlanEntity | null {
  const plans = listProductionPlans();
  return plans.find(plan => plan.id === id) || null;
}

export function createProductionPlan(plan: Omit<ProductionPlanEntity, 'id' | 'planNo' | 'createdAt' | 'updatedAt'>): ProductionPlanEntity {
  const plans = listProductionPlans();
  const newPlan: ProductionPlanEntity = {
    ...plan,
    id: uid("pp"),
    planNo: `PP-${new Date().getFullYear()}-${String(plans.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  plans.unshift(newPlan);
  localStorage.setItem('fake_production_plans_v1', JSON.stringify(plans));
  return newPlan;
}

export function updateProductionPlan(id: string, updates: Partial<ProductionPlanEntity>): ProductionPlanEntity | null {
  const plans = listProductionPlans();
  const index = plans.findIndex(plan => plan.id === id);
  if (index === -1) return null;
  
  plans[index] = {
    ...plans[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem('fake_production_plans_v1', JSON.stringify(plans));
  return plans[index];
}

export function deleteProductionPlan(id: string): boolean {
  const plans = listProductionPlans();
  const filteredPlans = plans.filter(plan => plan.id !== id);
  if (filteredPlans.length === plans.length) return false;
  
  localStorage.setItem('fake_production_plans_v1', JSON.stringify(filteredPlans));
  return true;
}
