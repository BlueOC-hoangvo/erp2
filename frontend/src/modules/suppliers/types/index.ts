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