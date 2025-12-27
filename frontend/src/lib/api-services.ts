// API Services Index
// Tất cả API services đã được tích hợp từ backend

// Authentication
export * from "../modules/auth/api/auth.api";

// Customers
export * from "../modules/customers/api/get-customers";
export * from "../modules/customers/api/get-customer-by-id";
export * from "../modules/customers/api/add-customer";
export * from "../modules/customers/api/update-customer";
export * from "../modules/customers/api/delete-customer";

// Suppliers
export * from "../modules/suppliers/api/suppliers.api";

// Users & Authentication
export * from "../modules/users/api/users.api";
export * from "../modules/roles/api/roles.api";
import * as PermissionsAPI from "../modules/permissions/api/permissions.api";
export { PermissionsAPI };

// Products & Items
export * from "../modules/items/api/items.api";
export * from "../modules/products/api/product-styles.api";
export * from "../modules/products/api/sizes.api";
export * from "../modules/products/api/colors.api";
export * from "../modules/products/api/product-variants.api";

// Warehouse & Inventory
export * from "../modules/warehouse-in/api/locations.api";
export * from "../modules/warehouse-in/api/warehouses.api";
export * from "../modules/warehouse-products/api/inventory.api";
export * from "../modules/warehouse-out/api/stock-moves.api";

// Orders
export * from "../modules/sales-orders/api/sales-orders.api";
export * from "../modules/purchasing/api/purchase-orders.api";
export * from "../modules/production-orders/api/production-orders.api";

// Production Parameters
export * from "../modules/production-params/api/boms.api";
