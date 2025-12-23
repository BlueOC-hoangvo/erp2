export interface WarehouseProductEntity {
  id: string;
  productCode: string;
  productName: string;
  category: 'FINISHED_GOOD' | 'RAW_MATERIAL' | 'WORK_IN_PROGRESS' | 'PACKAGING' | 'TOOL';
  subcategory: string;
  unit: string;
  unitPrice: number;
  supplier?: string;
  specifications: ProductSpecification[];
  stock: ProductStock;
  location: ProductLocation;
  quality: ProductQuality;
  barcode?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecification {
  id: string;
  specName: string;
  specValue: string;
  unit?: string;
  isRequired: boolean;
}

export interface ProductStock {
  currentStock: number;
  minStock: number;
  maxStock: number;
  reservedStock: number;
  availableStock: number;
  lastUpdated: string;
}

export interface ProductLocation {
  warehouse: string;
  zone: string;
  aisle?: string;
  shelf?: string;
  bin?: string;
}

export interface ProductQuality {
  grade: 'A' | 'B' | 'C' | 'REJECT';
  expiryDate?: string;
  lotNumber?: string;
  certificate?: string;
  lastInspection?: string;
}

export const WAREHOUSE_PRODUCT_CATEGORIES = {
  FINISHED_GOOD: { label: 'Thành phẩm', color: 'green' },
  RAW_MATERIAL: { label: 'Nguyên vật liệu', color: 'blue' },
  WORK_IN_PROGRESS: { label: 'Bán thành phẩm', color: 'orange' },
  PACKAGING: { label: 'Bao bì', color: 'purple' },
  TOOL: { label: 'Dụng cụ', color: 'cyan' }
} as const;

export const WAREHOUSE_PRODUCT_QUALITY = {
  A: { label: 'A - Cao cấp', color: 'green' },
  B: { label: 'B - Thường', color: 'blue' },
  C: { label: 'C - Cơ bản', color: 'orange' },
  REJECT: { label: 'Từ chối', color: 'red' }
} as const;

