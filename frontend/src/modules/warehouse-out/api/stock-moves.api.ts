import { api, unwrap } from "@/lib/api";

export type StockMoveLine = {
  id: number;
  itemId?: number;
  productVariantId?: number;
  uom: string;
  qty: number;
  fromLocationId?: number;
  toLocationId?: number;
  note?: string;
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
  fromLocation?: {
    id: number;
    name: string;
    code: string;
  };
  toLocation?: {
    id: number;
    name: string;
    code: string;
  };
};

export type StockMove = {
  id: number;
  moveNo: string;
  moveType: "RECEIPT" | "ISSUE" | "OUT" | "ADJUST" | "TRANSFER";
  warehouseId: number;
  warehouse?: {
    id: number;
    name: string;
    code: string;
  };
  status: "DRAFT" | "POSTED" | "CANCELLED";
  note?: string;
  lines: StockMoveLine[];
  createdAt: string;
  updatedAt: string;
};

export type StockMoveCreate = {
  moveNo: string;
  moveType: "RECEIPT" | "ISSUE" | "OUT" | "ADJUST" | "TRANSFER";
  warehouseId: number;
  note?: string;
  lines: Array<{
    itemId?: number;
    productVariantId?: number;
    uom?: string;
    qty: number;
    fromLocationId?: number;
    toLocationId?: number;
    note?: string;
  }>;
};

export type StockMoveUpdate = Partial<StockMoveCreate>;

export type StockMoveQuery = {
  warehouseId?: number;
  moveType?: "RECEIPT" | "ISSUE" | "OUT" | "ADJUST" | "TRANSFER";
  status?: "DRAFT" | "POSTED" | "CANCELLED";
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
};

export async function getStockMoves(query: StockMoveQuery = {}) {
  return unwrap<StockMove[]>(api.get("/stock-moves", { params: query }));
}

export async function getStockMoveById(id: number) {
  return unwrap<StockMove>(api.get(`/stock-moves/${id}`));
}

export async function createStockMove(data: StockMoveCreate) {
  return unwrap<StockMove>(api.post("/stock-moves", data));
}

export async function updateStockMove(id: number, data: StockMoveUpdate) {
  return unwrap<StockMove>(api.put(`/stock-moves/${id}`, data));
}

export async function deleteStockMove(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/stock-moves/${id}`));
}

export async function postStockMove(id: number) {
  return unwrap<StockMove>(api.post(`/stock-moves/${id}/post`));
}

export async function cancelStockMove(id: number) {
  return unwrap<StockMove>(api.post(`/stock-moves/${id}/cancel`));
}
