import { api, unwrap } from "@/lib/api";
import type { SalesOrder, CreateSalesOrderRequest, UpdateSalesOrderRequest, UpdateSalesOrderStatusRequest, ConvertToWorkOrderRequest } from "../types";

type CreateSalesOrderResponse = {
  data: SalesOrder;
};

type UpdateSalesOrderResponse = {
  data: SalesOrder;
};

type UpdateSalesOrderStatusResponse = {
  data: SalesOrder;
};

type ConvertToWorkOrderResponse = {
  data: {
    workOrderId: string;
    workOrderNumber: string;
    salesOrder: SalesOrder;
  };
};

export async function createSalesOrder(data: CreateSalesOrderRequest) {
  return unwrap<CreateSalesOrderResponse>(api.post('/sales-orders', data));
}

export async function updateSalesOrder(id: string, data: UpdateSalesOrderRequest) {
  return unwrap<UpdateSalesOrderResponse>(api.put(`/sales-orders/${id}`, data));
}

export async function deleteSalesOrder(id: string) {
  return unwrap<{ data: { success: boolean } }>(api.delete(`/sales-orders/${id}`));
}

export async function updateSalesOrderStatus(id: string, data: UpdateSalesOrderStatusRequest) {
  return unwrap<UpdateSalesOrderStatusResponse>(api.put(`/sales-orders/${id}/status`, data));
}

export async function convertToWorkOrder(id: string, data: ConvertToWorkOrderRequest) {
  return unwrap<ConvertToWorkOrderResponse>(api.post(`/sales-orders/${id}/convert-to-workorder`, data));
}
