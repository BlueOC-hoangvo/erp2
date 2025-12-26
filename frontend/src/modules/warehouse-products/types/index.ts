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

