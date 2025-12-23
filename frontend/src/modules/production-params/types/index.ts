export interface ProductionParamEntity {
  id: string;
  paramCode: string;
  paramName: string;
  category: 'MACHINE' | 'MATERIAL' | 'PROCESS' | 'QUALITY' | 'ENVIRONMENT';
  type: 'NUMBER' | 'TEXT' | 'BOOLEAN' | 'SELECT' | 'RANGE';
  unit?: string;
  defaultValue?: any;
  minValue?: number;
  maxValue?: number;
  options?: string[];
  description: string;
  isRequired: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductionParamValue {
  id: string;
  paramId: string;
  productionPlanId?: string;
  moId?: string;
  workCenterId?: string;
  value: any;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkCenterEntity {
  id: string;
  centerCode: string;
  centerName: string;
  department: string;
  capacity: number;
  efficiency: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  location: string;
  supervisor: string;
  parameters: ProductionParamValue[];
  createdAt: string;
  updatedAt: string;
}

export const PRODUCTION_PARAM_CATEGORIES = {
  MACHINE: { label: 'Máy móc', color: 'blue' },
  MATERIAL: { label: 'Nguyên vật liệu', color: 'green' },
  PROCESS: { label: 'Quy trình', color: 'orange' },
  QUALITY: { label: 'Chất lượng', color: 'purple' },
  ENVIRONMENT: { label: 'Môi trường', color: 'cyan' }
} as const;

export const PRODUCTION_PARAM_TYPES = {
  NUMBER: 'Số',
  TEXT: 'Văn bản',
  BOOLEAN: 'Đúng/Sai',
  SELECT: 'Lựa chọn',
  RANGE: 'Khoảng giá trị'
} as const;

export const WORK_CENTER_STATUS = {
  ACTIVE: { label: 'Hoạt động', color: 'green' },
  INACTIVE: { label: 'Ngừng hoạt động', color: 'red' },
  MAINTENANCE: { label: 'Bảo trì', color: 'orange' }
} as const;
