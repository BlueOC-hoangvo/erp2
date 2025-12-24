export interface Warehouse {
    id: string;
    warehouseId: string;
    code: string;
    name: string;
    parentId?: string;
    createdAt: string;
    updatedAt: string;
};

export interface Location {
    id: string;
    code: string;
    name: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
}

export interface WarehouseUpsertBody {
    warehouseId: string;
    code: string;
    name: string;
    parentId?: string;
};

export interface LocationUpsertBody {
    code: string;
    name: string;
    note?: string;
}