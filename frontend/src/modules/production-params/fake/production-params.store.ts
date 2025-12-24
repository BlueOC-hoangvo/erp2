import type { ProductionParamEntity, ProductionParamValue, WorkCenterEntity } from '../types';

const uid = (prefix = "pp") => `${prefix}_${Math.random().toString(16).slice(2)}_${Math.random().toString(16).slice(2)}`;

// Sample Production Parameters
const sampleParams: ProductionParamEntity[] = [
  {
    id: uid("param"),
    paramCode: "TEMP_CUTTING",
    paramName: "Nhiệt độ cắt",
    category: "MACHINE",
    type: "NUMBER",
    unit: "°C",
    defaultValue: 25,
    minValue: 20,
    maxValue: 30,
    description: "Nhiệt độ tối ưu cho quá trình cắt vải",
    isRequired: true,
    isActive: true,
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-01T08:00:00Z"
  },
  {
    id: uid("param"),
    paramCode: "HUMIDITY",
    paramName: "Độ ẩm",
    category: "ENVIRONMENT",
    type: "RANGE",
    unit: "%",
    minValue: 45,
    maxValue: 65,
    description: "Độ ẩm phù hợp trong xưởng sản xuất",
    isRequired: true,
    isActive: true,
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-01T08:00:00Z"
  },
  {
    id: uid("param"),
    paramCode: "THREAD_TYPE",
    paramName: "Loại chỉ",
    category: "MATERIAL",
    type: "SELECT",
    options: ["Cotton", "Polyester", "Mixed", "Silk"],
    defaultValue: "Cotton",
    description: "Loại chỉ được sử dụng trong sản xuất",
    isRequired: true,
    isActive: true,
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-01T08:00:00Z"
  },
  {
    id: uid("param"),
    paramCode: "AUTO_ALIGN",
    paramName: "Tự động căn chỉnh",
    category: "MACHINE",
    type: "BOOLEAN",
    defaultValue: true,
    description: "Bật tự động căn chỉnh cho máy may",
    isRequired: false,
    isActive: true,
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-01T08:00:00Z"
  },
  {
    id: uid("param"),
    paramCode: "QUALITY_CHECK_FREQ",
    paramName: "Tần suất kiểm tra chất lượng",
    category: "QUALITY",
    type: "SELECT",
    options: ["Every 10 pieces", "Every 50 pieces", "Every 100 pieces", "Daily"],
    defaultValue: "Every 50 pieces",
    description: "Tần suất thực hiện kiểm tra chất lượng",
    isRequired: true,
    isActive: true,
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-01T08:00:00Z"
  }
];

// Sample Work Centers
const sampleWorkCenters: WorkCenterEntity[] = [
  {
    id: uid("wc"),
    centerCode: "WC_CUTTING_01",
    centerName: "Trung tâm cắt 1",
    department: "Cắt",
    capacity: 1000,
    efficiency: 95,
    status: "ACTIVE",
    location: "Xưởng A - Tầng 1",
    supervisor: "Anh Minh",
    parameters: [
      {
        id: uid("ppv"),
        paramId: "pp_temp_cutting",
        workCenterId: "wc_cutting_01",
        value: 26,
        notes: "Nhiệt độ ổn định",
        createdAt: "2024-01-20T08:00:00Z",
        updatedAt: "2024-01-20T08:00:00Z"
      }
    ],
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z"
  },
  {
    id: uid("wc"),
    centerCode: "WC_SEWING_01",
    centerName: "Trung tâm may 1",
    department: "May",
    capacity: 800,
    efficiency: 88,
    status: "ACTIVE",
    location: "Xưởng B - Tầng 2",
    supervisor: "Chị Lan",
    parameters: [
      {
        id: uid("ppv"),
        paramId: "pp_thread_type",
        workCenterId: "wc_sewing_01",
        value: "Cotton",
        notes: "Sử dụng chỉ cotton cao cấp",
        createdAt: "2024-01-20T08:00:00Z",
        updatedAt: "2024-01-20T08:00:00Z"
      }
    ],
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z"
  },
  {
    id: uid("wc"),
    centerCode: "WC_QA_01",
    centerName: "Trung tâm kiểm tra chất lượng",
    department: "QA",
    capacity: 500,
    efficiency: 92,
    status: "ACTIVE",
    location: "Xưởng C - Tầng 1",
    supervisor: "Anh Tuấn",
    parameters: [
      {
        id: uid("ppv"),
        paramId: "pp_quality_freq",
        workCenterId: "wc_qa_01",
        value: "Every 50 pieces",
        notes: "Kiểm tra định kỳ theo quy trình",
        createdAt: "2024-01-20T08:00:00Z",
        updatedAt: "2024-01-20T08:00:00Z"
      }
    ],
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z"
  }
];

// Storage functions for Production Parameters
export function listProductionParams(): ProductionParamEntity[] {
  const stored = localStorage.getItem('fake_production_params_v1');
  if (!stored) {
    localStorage.setItem('fake_production_params_v1', JSON.stringify(sampleParams));
    return sampleParams;
  }
  return JSON.parse(stored);
}

export function getProductionParam(id: string): ProductionParamEntity | null {
  const params = listProductionParams();
  return params.find(param => param.id === id) || null;
}

export function createProductionParam(param: Omit<ProductionParamEntity, 'id' | 'createdAt' | 'updatedAt'>): ProductionParamEntity {
  const params = listProductionParams();
  const newParam: ProductionParamEntity = {
    ...param,
    id: uid("param"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  params.unshift(newParam);
  localStorage.setItem('fake_production_params_v1', JSON.stringify(params));
  return newParam;
}

export function updateProductionParam(id: string, updates: Partial<ProductionParamEntity>): ProductionParamEntity | null {
  const params = listProductionParams();
  const index = params.findIndex(param => param.id === id);
  if (index === -1) return null;
  
  params[index] = {
    ...params[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem('fake_production_params_v1', JSON.stringify(params));
  return params[index];
}

export function deleteProductionParam(id: string): boolean {
  const params = listProductionParams();
  const filteredParams = params.filter(param => param.id !== id);
  if (filteredParams.length === params.length) return false;
  
  localStorage.setItem('fake_production_params_v1', JSON.stringify(filteredParams));
  return true;
}

// Storage functions for Work Centers
export function listWorkCenters(): WorkCenterEntity[] {
  const stored = localStorage.getItem('fake_work_centers_v1');
  if (!stored) {
    localStorage.setItem('fake_work_centers_v1', JSON.stringify(sampleWorkCenters));
    return sampleWorkCenters;
  }
  return JSON.parse(stored);
}

export function getWorkCenter(id: string): WorkCenterEntity | null {
  const centers = listWorkCenters();
  return centers.find(center => center.id === id) || null;
}

export function createWorkCenter(center: Omit<WorkCenterEntity, 'id' | 'createdAt' | 'updatedAt'>): WorkCenterEntity {
  const centers = listWorkCenters();
  const newCenter: WorkCenterEntity = {
    ...center,
    id: uid("wc"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  centers.unshift(newCenter);
  localStorage.setItem('fake_work_centers_v1', JSON.stringify(centers));
  return newCenter;
}

export function updateWorkCenter(id: string, updates: Partial<WorkCenterEntity>): WorkCenterEntity | null {
  const centers = listWorkCenters();
  const index = centers.findIndex(center => center.id === id);
  if (index === -1) return null;
  
  centers[index] = {
    ...centers[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem('fake_work_centers_v1', JSON.stringify(centers));
  return centers[index];
}

export function deleteWorkCenter(id: string): boolean {
  const centers = listWorkCenters();
  const filteredCenters = centers.filter(center => center.id !== id);
  if (filteredCenters.length === centers.length) return false;
  
  localStorage.setItem('fake_work_centers_v1', JSON.stringify(filteredCenters));
  return true;
}
