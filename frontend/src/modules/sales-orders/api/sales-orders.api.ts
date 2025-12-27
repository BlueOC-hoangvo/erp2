import { api, unwrap } from "@/lib/api";
import type { 
  SalesOrder, 
  SalesOrderQuery
} from "../types";

// Local types for API requests
type CreateSalesOrderRequest = {
  orderNo: string;
  customerId: string;
  orderDate?: string;
  dueDate?: string;
  status?: "DRAFT" | "CONFIRMED" | "IN_PRODUCTION" | "DONE" | "CANCELLED";
  note?: string;
  isInternal?: boolean;
  items: Array<{
    lineNo: number;
    productStyleId: string;
    itemName: string;
    uom?: string;
    qtyTotal: string;
    unitPrice: string;
    note?: string;
    breakdowns?: Array<{
      productVariantId: string;
      qty: string;
    }>;
  }>;
};

type UpdateSalesOrderRequest = Partial<CreateSalesOrderRequest> & {
  customerId?: string;
  items?: Array<{
    lineNo: number;
    productStyleId: string;
    itemName: string;
    uom?: string;
    qtyTotal: string;
    unitPrice: string;
    note?: string;
    breakdowns?: Array<{
      productVariantId: string;
      qty: string;
    }>;
  }>;
};

/**
 * Lấy danh sách sales orders với phân trang và filtering
 */
export async function getSalesOrders(query: SalesOrderQuery = {}) {
  return unwrap<{
    data: {
      items: SalesOrder[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  }>(api.get("/sales-orders", { params: query }));
}

/**
 * Lấy chi tiết một sales order
 */
export async function getSalesOrderById(id: string) {
  return unwrap<SalesOrder>(api.get(`/sales-orders/${id}`));
}

/**
 * Tạo sales order mới
 */
export async function createSalesOrder(data: CreateSalesOrderRequest) {
  return unwrap<SalesOrder>(api.post("/sales-orders", data));
}

/**
 * Cập nhật sales order
 */
export async function updateSalesOrder(id: string, data: UpdateSalesOrderRequest) {
  return unwrap<SalesOrder>(api.put(`/sales-orders/${id}`, data));
}

/**
 * Xóa sales order
 */
export async function deleteSalesOrder(id: string) {
  return unwrap<{ ok: boolean }>(api.delete(`/sales-orders/${id}`));
}

/**
 * Xác nhận sales order (DRAFT -> CONFIRMED)
 */
export async function confirmSalesOrder(id: string) {
  return unwrap<{ ok: boolean }>(api.post(`/sales-orders/${id}/confirm`));
}

/**
 * Hủy sales order
 */
export async function cancelSalesOrder(id: string) {
  return unwrap<{ ok: boolean }>(api.post(`/sales-orders/${id}/cancel`));
}

/**
 * Tạo production order từ sales order
 */
export async function createProductionOrderFromSalesOrder(salesOrderId: string) {
  return unwrap<{ data: { id: string } }>(api.post(`/production-orders/from-sales-order/${salesOrderId}`));
}
