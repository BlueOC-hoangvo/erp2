import { api, unwrap } from "@/lib/api";
import type { 
  SalesOrderStatus 
} from "../types";

// API Request types aligned with backend
type CreateSalesOrderRequest = {
  orderNo: string;
  customerId: string;
  orderDate?: string;
  dueDate?: string;
  status?: SalesOrderStatus;
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

// Export functions from main API file
export { 
  getSalesOrders,
  getSalesOrderById,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  confirmSalesOrder,
  cancelSalesOrder
} from './sales-orders.api';

// Export types for external use
export type { CreateSalesOrderRequest };

// Additional helper functions
export async function convertToProductionOrder(id: string) {
  // This endpoint doesn't exist in backend yet
  // Could be implemented later if needed
  return unwrap<{ ok: boolean }>(api.post(`/sales-orders/${id}/convert-to-production`));
}
