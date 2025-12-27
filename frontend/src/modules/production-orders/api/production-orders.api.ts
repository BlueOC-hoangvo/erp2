import { api, unwrap } from "@/lib/api";
import type {
  ProductionOrderEntity,
  ProductionOrderCreate,
  ProductionOrderUpdate,
  ProductionOrderQuery,
} from '../types';

// Production Orders API
export async function getProductionOrders(query: ProductionOrderQuery = {}) {
  return unwrap<{ 
    items: ProductionOrderEntity[];
    total: number;
    page: number;
    pageSize: number;
  }>(api.get("/production-orders", { params: query }));
}

export async function getProductionOrderById(id: number) {
  return unwrap<ProductionOrderEntity>(api.get(`/production-orders/${id}`));
}

export async function createProductionOrder(data: ProductionOrderCreate) {
  return unwrap<{ id: string }>(api.post("/production-orders", data));
}

export async function updateProductionOrder(id: number, data: ProductionOrderUpdate) {
  return unwrap<{ ok: boolean }>(api.put(`/production-orders/${id}`, data));
}

export async function deleteProductionOrder(id: number) {
  return unwrap<{ ok: boolean }>(api.delete(`/production-orders/${id}`));
}

// Production Order Workflow Actions
export async function releaseProductionOrder(id: number) {
  return unwrap<{ ok: boolean }>(api.post(`/production-orders/${id}/release`));
}

export async function startProductionOrder(id: number) {
  return unwrap<{ ok: boolean }>(api.post(`/production-orders/${id}/start`));
}

export async function completeProductionOrder(id: number) {
  return unwrap<{ ok: boolean }>(api.post(`/production-orders/${id}/done`));
}

export async function cancelProductionOrder(id: number) {
  return unwrap<{ ok: boolean }>(api.post(`/production-orders/${id}/cancel`));
}

// Generate materials from BOM
export async function generateMaterials(id: number, mode: "replace" | "merge" = "replace") {
  return unwrap<{ 
    ok: boolean;
    mode: string;
    productionOrderId: string;
    bomId: string;
    items: any[];
  }>(api.post(`/production-orders/${id}/generate-materials`, { mode }));
}

// Create from Sales Order
export async function createFromSalesOrder(salesOrderId: number, userId?: number) {
  return unwrap<{ 
    ok: boolean;
    salesOrderId: string;
    createdProductionOrders: string[];
    message: string;
  }>(api.post(`/production-orders/create-from-sales-order/${salesOrderId}`, { userId }));
}
