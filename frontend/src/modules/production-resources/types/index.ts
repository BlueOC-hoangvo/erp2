export interface ProductionResourceEntity {
  id: string;
  resourceCode: string;
  resourceName: string;
  resourceType: 'MACHINE' | 'TOOL' | 'MATERIAL' | 'WORKER' | 'SPACE';
  category: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'RESERVED';
  location: string;
  capacity?: number;
  efficiency: number;
  costPerHour?: number;
  specifications: ResourceSpecification[];
  maintenanceSchedule?: MaintenanceSchedule[];
  usageHistory: ResourceUsage[];
  createdAt: string;
  updatedAt: string;
}

export interface ResourceSpecification {
  id: string;
  specName: string;
  specValue: string;
  unit?: string;
  isRequired: boolean;
}

export interface MaintenanceSchedule {
  id: string;
  scheduleType: 'PREVENTIVE' | 'CORRECTIVE' | 'PREDICTIVE';
  frequency: string;
  lastPerformed?: string;
  nextDue?: string;
  cost: number;
  notes: string;
}

export interface ResourceUsage {
  id: string;
  startTime: string;
  endTime?: string;
  moId?: string;
  planId?: string;
  operator: string;
  quantity?: number;
  efficiency: number;
  notes?: string;
}

export const PRODUCTION_RESOURCE_TYPES = {
  MACHINE: { label: 'Máy móc', color: 'blue' },
  TOOL: { label: 'Dụng cụ', color: 'green' },
  MATERIAL: { label: 'Nguyên vật liệu', color: 'orange' },
  WORKER: { label: 'Nhân công', color: 'purple' },
  SPACE: { label: 'Không gian', color: 'cyan' }
} as const;

export const PRODUCTION_RESOURCE_STATUS = {
  ACTIVE: { label: 'Hoạt động', color: 'green' },
  INACTIVE: { label: 'Ngừng hoạt động', color: 'red' },
  MAINTENANCE: { label: 'Bảo trì', color: 'orange' },
  RESERVED: { label: 'Đã đặt trước', color: 'blue' }
} as const;
