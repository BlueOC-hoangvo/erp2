import { WAREHOUSE_IN_STATUS } from "@/modules/warehouse-in/types";

export const URLS = {
  LOGIN: "/login",
  DASHBOARD: "/",

  // Sales
  SALES_CUSTOMERS: "/sales/customers",
  SALES_CUSTOMER_DETAIL: (id: string | number) => `/sales/customers/${id}`,
  SALES_PRODUCTS: "/sales/products",
  SALES_ORDERS: "/sales-orders",

  SALES_QUOTATIONS: "/sales/quotations",
  SALES_QUOTATION_CREATE: "/sales/quotations/create",
  SALES_QUOTATION_DETAIL: (id: string | number) => `/sales/quotations/${id}`,
  SALES_QUOTATION_EDIT: (id: string | number) => `/sales/quotations/${id}/edit`,

  // Production
  PRODUCTION_PLANS: "/production/plans",
  PRODUCTION_PARAMS: "/production/params",
  PRODUCTION_RESOURCES: "/production/resources",

  PRODUCTION_ORDERS: "/production/orders",
  PRODUCTION_ORDER_DETAIL: (id: string | number) => `/production/orders/${id}`,

  // Warehouse
  WAREHOUSE_PRODUCTS: "/warehouse/products",
  WAREHOUSE_IN: "/warehouse/in",
  WAREHOUSE_OUT: "/warehouse/out",
  WAREHOUSE_TRANSFER: "/warehouse/transfer",
  WAREHOUSE_LOCATION: "/warehouse/areas",

  // Supplier
  SUPPLIER: "/supplier",

  // Shipping
  SHIPPING_PARTNERS: "/shipping/partners",
  SHIPPING_VEHICLES: "/shipping/vehicles",
  SHIPPING_PLANS: "/shipping/plans",
  SHIPPING_SHIPMENTS: "/shipping/shipments",
  // Sales - Marketing
  SALES_CAMPAIGNS: "/sales/campaigns",
  SALES_CAMPAIGNS_CREATE: "/sales/campaigns/create",
  SALES_CAMPAIGNS_DETAIL: (id: string | number) => `/sales/campaigns/${id}`,
  SALES_CAMPAIGNS_EDIT: (id: string | number) => `/sales/campaigns/${id}/edit`,
  // System
  FILES: "/files",
  AUDIT_LOGS: "/system/audit-logs",
  STATUS: "/system/status",

  FORBIDDEN: "/403",
  NOT_FOUND: "/404",
} as const;
