import { api, unwrap } from "@/lib/api";

export type InventoryOnhand = {
  id: number;
  warehouseId?: number;
  locationId?: number;
  itemId?: number;
  productVariantId?: number;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  warehouse?: {
    id: number;
    name: string;
    code: string;
  };
  location?: {
    id: number;
    name: string;
    code: string;
  };
  item?: {
    id: number;
    name: string;
    sku?: string;
  };
  productVariant?: {
    id: number;
    name: string;
    sku?: string;
  };
};

export type InventoryLedger = {
  id: number;
  warehouseId?: number;
  locationId?: number;
  itemId?: number;
  productVariantId?: number;
  moveType: "RECEIPT" | "ISSUE" | "OUT" | "ADJUST" | "TRANSFER";
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  referenceType?: string;
  referenceId?: string;
  note?: string;
  warehouse?: {
    id: number;
    name: string;
    code: string;
  };
  location?: {
    id: number;
    name: string;
    code: string;
  };
  item?: {
    id: number;
    name: string;
    sku?: string;
  };
  productVariant?: {
    id: number;
    name: string;
    sku?: string;
  };
  createdAt: string;
};

export type OnhandQuery = {
  warehouseId?: number;
  locationId?: number;
  itemId?: number;
  productVariantId?: number;
  itemType?: "FABRIC" | "ACCESSORY" | "PACKING" | "OTHER";
  q?: string;
  page?: number;
  pageSize?: number;
};

export type LedgerQuery = {
  warehouseId?: number;
  locationId?: number;
  itemId?: number;
  productVariantId?: number;
  moveType?: "RECEIPT" | "ISSUE" | "OUT" | "ADJUST" | "TRANSFER";
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
};

export async function getInventoryOnhand(query: OnhandQuery = {}) {
  return unwrap<InventoryOnhand[]>(api.get("/inventory/onhand", { params: query }));
}

export async function getInventoryLedger(query: LedgerQuery = {}) {
  return unwrap<InventoryLedger[]>(api.get("/inventory/ledger", { params: query }));
}
