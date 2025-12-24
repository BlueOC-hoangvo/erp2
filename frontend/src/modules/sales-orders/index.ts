// Sales Orders Module - Main Export File
// Clean imports cho các components và modules khác

// Types
export type {
  SalesOrder,
  SalesOrderStatus,
  SalesOrderItem,
  SalesOrderBreakdown,
  SalesOrderQuery,
  CreateSalesOrderRequest,
  UpdateSalesOrderRequest,
  SalesOrderFormData,
  SALES_ORDER_STATUS_COLORS,
  SALES_ORDER_STATUS_LABELS,
} from "./types";

// API Functions
export {
  getSalesOrders,
  getSalesOrderById,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  confirmSalesOrder,
  cancelSalesOrder,
} from "./api/sales-orders.api";

// Custom Hooks
export {
  useSalesOrders,
  useSalesOrder,
  useCreateSalesOrder,
  useUpdateSalesOrder,
  useDeleteSalesOrder,
  useConfirmSalesOrder,
  useCancelSalesOrder,
  useSalesOrderActions,
} from "./api/hooks/useSalesOrders";

// Utility Functions
export {
  formatCurrency,
  formatDate,
  formatDateTime,
  parseDecimal,
  calculateItemTotal,
  calculateOrderTotal,
  getStatusColor,
  getStatusLabel,
  convertToTableRow,
  convertToFormData,
  convertFormToApiRequest,
  validateSalesOrder,
  generateLineNumbers,
  sortOrders,
  filterOrders,
} from "./utils/mappers";

// Components
export { SalesOrdersList } from "./views/SalesOrdersList";
export { SalesOrdersForm } from "./views/SalesOrdersForm";
export { SalesOrdersDetail } from "./views/SalesOrdersDetail";
