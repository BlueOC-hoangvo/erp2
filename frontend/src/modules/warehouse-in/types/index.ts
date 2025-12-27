export interface WarehouseIn {
  id: number;
  poNo: string;
  supplierId: number;
  createdById: number;
  orderDate: string;
  status: 'DRAFT' | 'CONFIRMED' | 'RECEIVING' | 'RECEIVED' | 'CANCELLED';
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
    id: string;
    code: string;
    name: string;
    taxCode?: string;
    phone?: string;
    email?: string;
    address?: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
};

export interface SupplierUpsertBody {
    code: string;
    name: string;
    taxCode?: string;
    phone?: string;
    email?: string;
    address?: string;
    note?: string;
}

export interface Item {
    id: number;
    sku: string;
    name: string;
    itemType?: 'FABRIC' | 'ACCESSORY' | 'PACKING' | 'OTHER';
    baseUom: string;
    isActive: boolean;
    note: string;
    createdAt: string;
    updatedAt: string;
};

export interface ItemUpsertBody {
    sku: string;
    name: string;
    itemType?: 'FABRIC' | 'ACCESSORY' | 'PACKING' | 'OTHER';
    baseUom: string;
    isActive: boolean;
    note: string;
}

