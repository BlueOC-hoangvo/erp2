export interface Warehouse {
    id: number;
    code: string;
    name: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
};

export interface Location {
    id: number;
    warehouseId: number;
    code: string;
    name: string;
    parentId?: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface WarehouseUpsertBody {
    code: string;
    name: string;
    note?: string;
};

export interface LocationUpsertBody {
    warehouseId:  number;
    code: string;
    name: string;
    parentId?: number | null;
}