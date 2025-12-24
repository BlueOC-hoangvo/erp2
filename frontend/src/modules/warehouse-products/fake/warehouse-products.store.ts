
import type { WarehouseProductEntity, ProductSpecification, ProductStock, ProductLocation, ProductQuality } from '../types';

const uid = (prefix = "wp") => `${prefix}_${Math.random().toString(16).slice(2)}_${Math.random().toString(16).slice(2)}`;

// Sample Warehouse Products
const sampleProducts: WarehouseProductEntity[] = [
  {
    id: uid("wp"),
    productCode: "RM_COTTON_001",
    productName: "Vải cotton 100% - Màu trắng",
    category: "RAW_MATERIAL",
    subcategory: "Vải cotton",
    unit: "m",
    unitPrice: 45000,
    supplier: "Vina Textile Co.",
    specifications: [
      {
        id: uid("spec"),
        specName: "Khổ vải",
        specValue: "150",
        unit: "cm",
        isRequired: true
      },
      {
        id: uid("spec"),
        specName: "Trọng lượng",
        specValue: "180",
        unit: "gsm",
        isRequired: true
      },
      {
        id: uid("spec"),
        specName: "Thành phần",
        specValue: "100% Cotton",
        unit: "",
        isRequired: true
      }
    ],
    stock: {
      currentStock: 2500,
      minStock: 500,
      maxStock: 5000,
      reservedStock: 200,
      availableStock: 2300,
      lastUpdated: "2024-01-20T10:30:00Z"
    },
    location: {
      warehouse: "Kho A",
      zone: "NVL-01",
      aisle: "A1",
      shelf: "S1",
      bin: "B5"
    },
    quality: {
      grade: "A",
      lotNumber: "LOT20240115",
      certificate: "OEKO-TEX Standard 100",
      lastInspection: "2024-01-15T08:00:00Z"
    },
    barcode: "8931234567890",
    isActive: true,
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-01-20T10:30:00Z"
  },
  {
    id: uid("wp"),
    productCode: "FG_TSHIRT_BASIC",
    productName: "Áo thun basic nam",
    category: "FINISHED_GOOD",
    subcategory: "Áo thun",
    unit: "pcs",
    unitPrice: 85000,
    specifications: [
      {
        id: uid("spec"),
        specName: "Chất liệu",
        specValue: "100% Cotton",
        unit: "",
        isRequired: true
      },
      {
        id: uid("spec"),
        specName: "Định lượng",
        specValue: "180",
        unit: "gsm",
        isRequired: true
      },
      {
        id: uid("spec"),
        specName: "Kiểu dáng",
        specValue: "Regular fit",
        unit: "",
        isRequired: false
      }
    ],
    stock: {
      currentStock: 1200,
      minStock: 100,
      maxStock: 2000,
      reservedStock: 50,
      availableStock: 1150,
      lastUpdated: "2024-01-20T14:15:00Z"
    },
    location: {
      warehouse: "Kho B",
      zone: "TP-01",
      aisle: "B2",
      shelf: "S3",
      bin: "A2"
    },
    quality: {
      grade: "A",
      lotNumber: "FG20240118",
      lastInspection: "2024-01-18T09:00:00Z"
    },
    barcode: "8931234567891",
    imageUrl: "/images/tshirt-basic.jpg",
    isActive: true,
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-20T14:15:00Z"
  },
  {
    id: uid("wp"),
    productCode: "PK_BOX_M",
    productName: "Hộp đóng gói size M",
    category: "PACKAGING",
    subcategory: "Hộp carton",
    unit: "pcs",
    unitPrice: 3500,
    supplier: "ABC Packaging",
    specifications: [
      {
        id: uid("spec"),
        specName: "Kích thước",
        specValue: "30x20x10",
        unit: "cm",
        isRequired: true
      },
      {
        id: uid("spec"),
        specName: "Độ dày",
        specValue: "3",
        unit: "mm",
        isRequired: true
      },
      {
        id: uid("spec"),
        specName: "Chất liệu",
        specValue: "Carton 3 lớp",
        unit: "",
        isRequired: true
      }
    ],
    stock: {
      currentStock: 5000,
      minStock: 1000,
      maxStock: 10000,
      reservedStock: 300,
      availableStock: 4700,
      lastUpdated: "2024-01-20T11:00:00Z"
    },
    location: {
      warehouse: "Kho A",
      zone: "BB-01",
      aisle: "C1",
      shelf: "S2",
      bin: "C1"
    },
    quality: {
      grade: "A",
      lotNumber: "PK20240110",
      lastInspection: "2024-01-10T10:00:00Z"
    },
    isActive: true,
    createdAt: "2024-01-05T08:00:00Z",
    updatedAt: "2024-01-20T11:00:00Z"
  },
  {
    id: uid("wp"),
    productCode: "TOOL_NEEDLE_14",
    productName: "Kim may #14",
    category: "TOOL",
    subcategory: "Kim may",
    unit: "pcs",
    unitPrice: 500,
    supplier: "Sewing Tools Co.",
    specifications: [
      {
        id: uid("spec"),
        specName: "Kích cỡ",
        specValue: "14",
        unit: "gauge",
        isRequired: true
      },
      {
        id: uid("spec"),
        specName: "Chất liệu",
        specValue: "Thép không gỉ",
        unit: "",
        isRequired: true
      },
      {
        id: uid("spec"),
        specName: "Loại",
        specValue: "DBx1",
        unit: "",
        isRequired: true
      }
    ],
    stock: {
      currentStock: 15000,
      minStock: 2000,
      maxStock: 20000,
      reservedStock: 500,
      availableStock: 14500,
      lastUpdated: "2024-01-19T16:30:00Z"
    },
    location: {
      warehouse: "Kho A",
      zone: "DC-01",
      aisle: "D1",
      shelf: "S1",
      bin: "A1"
    },
    quality: {
      grade: "B",
      lotNumber: "TOOL20240108",
      lastInspection: "2024-01-08T14:00:00Z"
    },
    isActive: true,
    createdAt: "2024-01-02T08:00:00Z",
    updatedAt: "2024-01-19T16:30:00Z"
  },
  {
    id: uid("wp"),
    productCode: "WIP_HALF_SHIRT",
    productName: "Áo sơ mi nửa hoàn thiện",
    category: "WORK_IN_PROGRESS",
    subcategory: "Bán thành phẩm may mặc",
    unit: "pcs",
    unitPrice: 35000,
    specifications: [
      {
        id: uid("spec"),
        specName: "Giai đoạn",
        specValue: "Sau may thân",
        unit: "",
        isRequired: true
      },
      {
        id: uid("spec"),
        specName: "Còn lại",
        specValue: "May tay, hoàn thiện",
        unit: "",
        isRequired: true
      }
    ],
    stock: {
      currentStock: 350,
      minStock: 50,
      maxStock: 800,
      reservedStock: 100,
      availableStock: 250,
      lastUpdated: "2024-01-20T13:45:00Z"
    },
    location: {
      warehouse: "Kho C",
      zone: "WIP-01",
      aisle: "W1",
      shelf: "S1",
      bin: "B2"
    },
    quality: {
      grade: "B",
      lotNumber: "WIP20240120",
      lastInspection: "2024-01-20T08:00:00Z"
    },
    isActive: true,
    createdAt: "2024-01-18T08:00:00Z",
    updatedAt: "2024-01-20T13:45:00Z"
  }
];

// Storage functions
export function listWarehouseProducts(): WarehouseProductEntity[] {
  const stored = localStorage.getItem('fake_warehouse_products_v1');
  if (!stored) {
    localStorage.setItem('fake_warehouse_products_v1', JSON.stringify(sampleProducts));
    return sampleProducts;
  }
  return JSON.parse(stored);
}

export function getWarehouseProduct(id: string): WarehouseProductEntity | null {
  const products = listWarehouseProducts();
  return products.find(product => product.id === id) || null;
}

export function createWarehouseProduct(product: Omit<WarehouseProductEntity, 'id' | 'createdAt' | 'updatedAt'>): WarehouseProductEntity {
  const products = listWarehouseProducts();
  const newProduct: WarehouseProductEntity = {
    ...product,
    id: uid("wp"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  products.unshift(newProduct);
  localStorage.setItem('fake_warehouse_products_v1', JSON.stringify(products));
  return newProduct;
}

export function updateWarehouseProduct(id: string, updates: Partial<WarehouseProductEntity>): WarehouseProductEntity | null {
  const products = listWarehouseProducts();
  const index = products.findIndex(product => product.id === id);
  if (index === -1) return null;
  
  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem('fake_warehouse_products_v1', JSON.stringify(products));
  return products[index];
}

export function deleteWarehouseProduct(id: string): boolean {
  const products = listWarehouseProducts();
  const filteredProducts = products.filter(product => product.id !== id);
  if (filteredProducts.length === products.length) return false;
  
  localStorage.setItem('fake_warehouse_products_v1', JSON.stringify(filteredProducts));
  return true;
}

// Stock management functions
export function updateStock(productId: string, quantity: number, type: 'IN' | 'OUT' | 'RESERVE' | 'RELEASE'): boolean {
  const products = listWarehouseProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return false;

  const currentStock = product.stock.currentStock;
  const reservedStock = product.stock.reservedStock;
  const availableStock = product.stock.availableStock;

  switch (type) {
    case 'IN':
      product.stock.currentStock = currentStock + quantity;
      product.stock.availableStock = availableStock + quantity;
      break;
    case 'OUT':
      if (currentStock < quantity) return false;
      product.stock.currentStock = currentStock - quantity;
      product.stock.availableStock = availableStock - quantity;
      break;
    case 'RESERVE':
      if (availableStock < quantity) return false;
      product.stock.reservedStock = reservedStock + quantity;
      product.stock.availableStock = availableStock - quantity;
      break;
    case 'RELEASE':
      if (reservedStock < quantity) return false;
      product.stock.reservedStock = reservedStock - quantity;
      product.stock.availableStock = availableStock + quantity;
      break;
  }

  product.stock.lastUpdated = new Date().toISOString();
  localStorage.setItem('fake_warehouse_products_v1', JSON.stringify(products));
  return true;
}

