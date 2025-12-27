

export const URLS = {
  LOGIN: "/login",
  DASHBOARD: "/",

  // BOM Management
  BOMS: "/boms",
  BOMS_CREATE: "/boms/create",
  BOMS_EDIT: (id: string | number) => `/boms/${id}/edit`,
  BOMS_DETAIL: (id: string | number) => `/boms/${id}`,
  BOMS_EXPLOSION: (id: string | number) => `/boms/${id}/explosion`,
  BOMS_COST: (id: string | number) => `/boms/${id}/cost`,
  BOMS_VERSIONS: (id: string | number) => `/boms/${id}/versions`,
  BOMS_COMPARISON: "/boms/compare",
  BOMS_TEMPLATES: "/boms/templates",
  BOMS_PRODUCTION_INTEGRATION: (id: string | number) => `/boms/${id}/production`,
  PRODUCTION_ORDER_FROM_BOM: "/production/orders/create-from-bom",

  // Sales
  SALES_CUSTOMERS: "/sales/customers",
  SALES_CUSTOMER_DETAIL: (id: string | number) => `/sales/customers/${id}`,
  SALES_PRODUCTS: "/sales/products",
  SALES_ORDERS: "/sales-orders",

  // Product Management
  PRODUCT_STYLES: "/product-styles/styles",
  COLORS: "/product-styles/colors",
  SIZES: "/product-styles/sizes", 
  PRODUCT_VARIANTS: "/product-styles/variants",

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
  WAREHOUSE_LOCATION: "/warehouse-location",

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

// Export for backward compatibility
export const urls = URLS;
