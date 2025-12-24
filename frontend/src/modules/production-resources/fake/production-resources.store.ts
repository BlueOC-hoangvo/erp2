import type { ProductionResourceEntity, ResourceSpecification, MaintenanceSchedule, ResourceUsage } from '../types';

const uid = (prefix = "pr") => `${prefix}_${Math.random().toString(16).slice(2)}_${Math.random().toString(16).slice(2)}`;

// Sample Production Resources
const sampleResources: ProductionResourceEntity[] = [
  {
    id: uid("pr"),
    resourceCode: "MACHINE_001",
    resourceName: "Máy cắt laser CNC",
    resourceType: "MACHINE",
    category: "Cắt",
    status: "ACTIVE",
    location: "Xưởng A - Tầng 1",
    capacity: 500,
    efficiency: 95,
    costPerHour: 150000,
    specifications: [
      {
        id: uid("spec"),
        specName: "Công suất laser",
        specValue: "2000W",
        unit: "W",
        isRequired: true
      },
      {
        id: uid("spec"),
        specName: "Vùng cắt tối đa",
        specValue: "3000x2000",
        unit: "mm",
        isRequired: true
      },
      {
        id: uid("spec"),
        specName: "Độ chính xác",
        specValue: "±0.1",
        unit: "mm",
        isRequired: true
      }
    ],
    maintenanceSchedule: [
      {
        id: uid("ms"),
        scheduleType: "PREVENTIVE",
        frequency: "Monthly",
        lastPerformed: "2024-01-15T08:00:00Z",
        nextDue: "2024-02-15T08:00:00Z",
        cost: 2000000,
        notes: "Kiểm tra và vệ sinh hệ thống laser"
      }
    ],
    usageHistory: [
      {
        id: uid("usage"),
        startTime: "2024-01-20T08:00:00Z",
        endTime: "2024-01-20T17:00:00Z",
        moId: "mo_001",
        planId: "pp_001",
        operator: "Anh Minh",
        quantity: 250,
        efficiency: 96,
        notes: "Cắt áo thun basic - hoàn thành đúng tiến độ"
      }
    ],
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z"
  },
  {
    id: uid("pr"),
    resourceCode: "MACHINE_002",
    resourceName: "Máy may công nghiệp Juki",
    resourceType: "MACHINE",
    category: "May",
    status: "ACTIVE",
    location: "Xưởng B - Tầng 2",
    capacity: 300,
    efficiency: 88,
    costPerHour: 80000,
    specifications: [
      {
        id: uid("spec"),
        specName: "Tốc độ may tối đa",
        specValue: "5500",
        unit: "stitches/min",
        isRequired: true
      },
      {
        id: uid("spec"),
        specName: "Loại kim",
        specValue: "DBx1 #14",
        unit: "size",
        isRequired: false
      }
    ],
    maintenanceSchedule: [
      {
        id: uid("ms"),
        scheduleType: "PREVENTIVE",
        frequency: "Weekly",
        lastPerformed: "2024-01-18T08:00:00Z",
        nextDue: "2024-01-25T08:00:00Z",
        cost: 300000,
        notes: "Vệ sinh và bôi trơn"
      }
    ],
    usageHistory: [
      {
        id: uid("usage"),
        startTime: "2024-01-20T08:00:00Z",
        endTime: "2024-01-20T16:30:00Z",
        moId: "mo_002",
        planId: "pp_001",
        operator: "Chị Lan",
        quantity: 150,
        efficiency: 89,
        notes: "May áo polo - chất lượng tốt"
      }
    ],
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z"
  },
  {
    id: uid("pr"),
    resourceCode: "WORKER_001",
    resourceName: "Anh Tuấn - Thợ cắt bậc cao",
    resourceType: "WORKER",
    category: "Cắt",
    status: "ACTIVE",
    location: "Xưởng A - Tầng 1",
    efficiency: 92,
    costPerHour: 45000,
    specifications: [
      {
        id: uid("spec"),
        specName: "Kinh nghiệm",
        specValue: "8",
        unit: "năm",
        isRequired: true
      },
      {
        id: uid("spec"),
        specName: "Chứng chỉ",
        specValue: "Thợ cắt bậc 3",
        unit: "",
        isRequired: true
      }
    ],
    maintenanceSchedule: [],
    usageHistory: [
      {
        id: uid("usage"),
        startTime: "2024-01-20T08:00:00Z",
        endTime: "2024-01-20T17:00:00Z",
        moId: "mo_001",
        planId: "pp_001",
        operator: "Quản lý sản xuất",
        quantity: 250,
        efficiency: 94,
        notes: "Cắt chính xác, không có lỗi"
      }
    ],
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z"
  },
  {
    id: uid("pr"),
    resourceCode: "TOOL_001",
    resourceName: "Bàn là hơi công nghiệp",
    resourceType: "TOOL",
    category: "Ủi",
    status: "ACTIVE",
    location: "Xưởng C - Tầng 1",
    efficiency: 85,
    costPerHour: 25000,
    specifications: [
      {
        id: uid("spec"),
        specName: "Nhiệt độ tối đa",
        specValue: "200",
        unit: "°C",
        isRequired: true
      },
      {
        id: uid("spec"),
        specName: "Áp suất hơi",
        specValue: "5",
        unit: "bar",
        isRequired: true
      }
    ],
    maintenanceSchedule: [
      {
        id: uid("ms"),
        scheduleType: "PREVENTIVE",
        frequency: "Quarterly",
        lastPerformed: "2023-12-01T08:00:00Z",
        nextDue: "2024-03-01T08:00:00Z",
        cost: 500000,
        notes: "Kiểm tra hệ thống hơi nước"
      }
    ],
    usageHistory: [
      {
        id: uid("usage"),
        startTime: "2024-01-19T08:00:00Z",
        endTime: "2024-01-19T17:00:00Z",
        moId: "mo_003",
        operator: "Chị Mai",
        quantity: 200,
        efficiency: 87,
        notes: "Ủi hoàn thiện sản phẩm"
      }
    ],
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-19T08:00:00Z"
  }
];

// Storage functions
export function listProductionResources(): ProductionResourceEntity[] {
  const stored = localStorage.getItem('fake_production_resources_v1');
  if (!stored) {
    localStorage.setItem('fake_production_resources_v1', JSON.stringify(sampleResources));
    return sampleResources;
  }
  return JSON.parse(stored);
}

export function getProductionResource(id: string): ProductionResourceEntity | null {
  const resources = listProductionResources();
  return resources.find(resource => resource.id === id) || null;
}

export function createProductionResource(resource: Omit<ProductionResourceEntity, 'id' | 'createdAt' | 'updatedAt'>): ProductionResourceEntity {
  const resources = listProductionResources();
  const newResource: ProductionResourceEntity = {
    ...resource,
    id: uid("pr"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  resources.unshift(newResource);
  localStorage.setItem('fake_production_resources_v1', JSON.stringify(resources));
  return newResource;
}

export function updateProductionResource(id: string, updates: Partial<ProductionResourceEntity>): ProductionResourceEntity | null {
  const resources = listProductionResources();
  const index = resources.findIndex(resource => resource.id === id);
  if (index === -1) return null;
  
  resources[index] = {
    ...resources[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem('fake_production_resources_v1', JSON.stringify(resources));
  return resources[index];
}

export function deleteProductionResource(id: string): boolean {
  const resources = listProductionResources();
  const filteredResources = resources.filter(resource => resource.id !== id);
  if (filteredResources.length === resources.length) return false;
  
  localStorage.setItem('fake_production_resources_v1', JSON.stringify(filteredResources));
  return true;
}
