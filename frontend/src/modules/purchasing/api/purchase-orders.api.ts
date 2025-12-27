import { api, unwrap } from "@/lib/api";

export type PurchaseOrderLine = {
  id: number;
  lineNo: number;
  itemId: number;
  uom: string;
  qty: number;
  unitPrice: number;
  totalAmount: number;
  receivedQty: number;
  item?: {
    id: number;
    name: string;
    sku?: string;
  };
};

export type PurchaseOrder = {
  id: number;
  poNo: string;
  supplierId: number;
  supplier?: {
    id: number;
    name: string;
    code?: string;
  };
  orderDate: string;
  status: "DRAFT" | "CONFIRMED" | "RECEIVING" | "RECEIVED" | "CANCELLED";
  note?: string;
  totalAmount: number;
  lines: PurchaseOrderLine[];
  createdAt: string;
  updatedAt: string;
};

export type PurchaseOrderCreate = {
  poNo: string;
  supplierId: number;
  orderDate?: string;
  status?: "DRAFT" | "CONFIRMED" | "RECEIVING" | "RECEIVED" | "CANCELLED";
  note?: string;
  lines: Array<{
    lineNo: number;
    itemId: number;
    uom?: string;
    qty: number;
    unitPrice: number;
  }>;
};

export type PurchaseOrderUpdate = Partial<PurchaseOrderCreate> & {
  supplierId?: number;
  lines?: Array<{
    lineNo: number;
    itemId: number;
    uom?: string;
    qty: number;
    unitPrice: number;
  }>;
};

export type PurchaseOrderQuery = {
  q?: string;
  supplierId?: number;
  status?: "DRAFT" | "CONFIRMED" | "RECEIVING" | "RECEIVED" | "CANCELLED";
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
};

export async function getPurchaseOrders(query: PurchaseOrderQuery = {}) {
  return unwrap<PurchaseOrder[]>(api.get("/purchase-orders", { params: query }));
}

export async function getPurchaseOrderById(id: number) {
  return unwrap<PurchaseOrder>(api.get(`/purchase-orders/${id}`));
}

export async function createPurchaseOrder(data: PurchaseOrderCreate) {
  return unwrap<PurchaseOrder>(api.post("/purchase-orders", data));
}

export async function updatePurchaseOrder(id: number, data: PurchaseOrderUpdate) {
  return unwrap<PurchaseOrder>(api.put(`/purchase-orders/${id}`, data));
}

export async function deletePurchaseOrder(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/purchase-orders/${id}`));
}

export async function confirmPurchaseOrder(id: number) {
  return unwrap<PurchaseOrder>(api.post(`/purchase-orders/${id}/confirm`));
}

export async function receivePurchaseOrder(id: number, lines: Array<{
  lineId: number;
  receivedQty: number;
}>) {
  return unwrap<PurchaseOrder>(api.post(`/purchase-orders/${id}/receive`, { lines }));
}

export async function cancelPurchaseOrder(id: number) {
  return unwrap<PurchaseOrder>(api.post(`/purchase-orders/${id}/cancel`));
}
