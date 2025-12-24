import { api, unwrap } from "@/lib/api";

export type ProductionOrderBreakdown = {
  id: number;
  productVariantId: number;
  qtyPlan: number;
  qtyDone: number;
  productVariant?: {
    id: number;
    name: string;
    sku?: string;
  };
};

export type ProductionOrderMaterial = {
  id: number;
  itemId: number;
  uom: string;
  qtyRequired: number;
  qtyIssued: number;
  wastagePercent: number;
  item?: {
    id: number;
    name: string;
    sku?: string;
  };
};

export type ProductionOrder = {
  id: number;
  moNo: string;
  salesOrderItemId?: number;
  productStyleId: number;
  productStyle?: {
    id: number;
    name: string;
    code: string;
  };
  qtyPlan: number;
  qtyDone: number;
  startDate?: string;
  dueDate?: string;
  status: "DRAFT" | "RELEASED" | "RUNNING" | "DONE" | "CANCELLED";
  note?: string;
  breakdowns: ProductionOrderBreakdown[];
  materialRequirements: ProductionOrderMaterial[];
  createdAt: string;
  updatedAt: string;
};

export type ProductionOrderCreate = {
  moNo: string;
  salesOrderItemId?: number;
  productStyleId: number;
  qtyPlan: number;
  startDate?: string;
  dueDate?: string;
  status?: "DRAFT" | "RELEASED" | "RUNNING" | "DONE" | "CANCELLED";
  note?: string;
  breakdowns?: Array<{
    productVariantId: number;
    qtyPlan: number;
    qtyDone?: number;
  }>;
  materialRequirements?: Array<{
    itemId: number;
    uom?: string;
    qtyRequired: number;
    qtyIssued?: number;
    wastagePercent?: number;
  }>;
};

export type ProductionOrderUpdate = Partial<ProductionOrderCreate> & {
  productStyleId?: number;
  qtyPlan?: number;
};

export type ProductionOrderQuery = {
  q?: string;
  status?: "DRAFT" | "RELEASED" | "RUNNING" | "DONE" | "CANCELLED";
  productStyleId?: number;
  page?: number;
  pageSize?: number;
};

export async function getProductionOrders(query: ProductionOrderQuery = {}) {
  return unwrap<ProductionOrder[]>(api.get("/production-orders", { params: query }));
}

export async function getProductionOrderById(id: number) {
  return unwrap<ProductionOrder>(api.get(`/production-orders/${id}`));
}

export async function createProductionOrder(data: ProductionOrderCreate) {
  return unwrap<ProductionOrder>(api.post("/production-orders", data));
}

export async function updateProductionOrder(id: number, data: ProductionOrderUpdate) {
  return unwrap<ProductionOrder>(api.put(`/production-orders/${id}`, data));
}

export async function deleteProductionOrder(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/production-orders/${id}`));
}

export async function releaseProductionOrder(id: number) {
  return unwrap<ProductionOrder>(api.post(`/production-orders/${id}/release`));
}

export async function startProductionOrder(id: number) {
  return unwrap<ProductionOrder>(api.post(`/production-orders/${id}/start`));
}

export async function completeProductionOrder(id: number) {
  return unwrap<ProductionOrder>(api.post(`/production-orders/${id}/complete`));
}

export async function cancelProductionOrder(id: number) {
  return unwrap<ProductionOrder>(api.post(`/production-orders/${id}/cancel`));
}

export async function generateMaterials(id: number, mode: "replace" | "merge" = "replace") {
  return unwrap<ProductionOrder>(api.post(`/production-orders/${id}/generate-materials`, { mode }));
}
