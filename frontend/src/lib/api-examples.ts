// Hướng dẫn sử dụng API Services
// File này cung cấp ví dụ cách sử dụng tất cả API services đã tích hợp

import { 
  // Authentication
  loginApi, logoutApi,
  
  // Customers
  getCustomers, getCustomerById, addCustomer, updateCustomer, deleteCustomer,
  
  // Suppliers
  getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier,
  
  // Users & Roles
  getUsers, getUserById, createUser, updateUser, deleteUser,
  getRoles, getRoleById, createRole, updateRole, deleteRole,
  PermissionsAPI,
  
  // Products & Items
  getItems, getItemById, createItem, updateItem, deleteItem,
  getProductStyles, getProductStyleById, createProductStyle, updateProductStyle, deleteProductStyle,
  getSizes, getSizeById, createSize, updateSize, deleteSize,
  getColors, getColorById, createColor, updateColor, deleteColor,
  getProductVariants, getProductVariantById, createProductVariant, updateProductVariant, deleteProductVariant,
  
  // Warehouse & Inventory
  getLocations, getLocationById, createLocation, updateLocation, deleteLocation,
  getWarehouses, getWarehouseById, createWarehouse, updateWarehouse, deleteWarehouse,
  getStockMoves, getStockMoveById, createStockMove, updateStockMove, deleteStockMove,
  
  // Orders
  getSalesOrders, getSalesOrderById, createSalesOrder, updateSalesOrder, deleteSalesOrder,
  confirmSalesOrder, cancelSalesOrder,
  getPurchaseOrders, getPurchaseOrderById, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder,
  confirmPurchaseOrder, receivePurchaseOrder, cancelPurchaseOrder,
  getProductionOrders, getProductionOrderById, createProductionOrder, updateProductionOrder, deleteProductionOrder,
  releaseProductionOrder, startProductionOrder, completeProductionOrder, cancelProductionOrder,
  
  // Production Parameters
  getBoms, getBomById, createBom, updateBom, deleteBom
} from "@/lib/api-services";

// ===== VÍ DỤ SỬ DỤNG =====

/**
 * 1. AUTHENTICATION
 */
export const authExamples = {
  // Đăng nhập
  async loginExample() {
    try {
      const response = await loginApi({
        email: "admin@example.com",
        password: "password123"
      });
      console.log("Login success:", response);
      return response;
    } catch (error) {
      console.error("Login failed:", error);
    }
  }
};

/**
 * 2. CUSTOMERS MANAGEMENT
 */
export const customerExamples = {
  // Lấy danh sách customers với pagination
  async getCustomersExample() {
    try {
      const response = await getCustomers({
        page: 1,
        limit: 20,
        q: "search term"
      });
      console.log("Customers:", response);
      return response;
    } catch (error) {
      console.error("Get customers failed:", error);
    }
  },

  // Lấy customer theo ID
  async getCustomerExample(id: string) {
    try {
      const customer = await getCustomerById(id);
      console.log("Customer:", customer);
      return customer;
    } catch (error) {
      console.error("Get customer failed:", error);
    }
  },

  // Tạo customer mới
  async createCustomerExample() {
    try {
      const customer = await addCustomer({
        code: "CUST001",
        name: "Customer Name",
        email: "customer@example.com",
        phone: "0123456789",
        address: "123 Street"
      });
      console.log("Created customer:", customer);
      return customer;
    } catch (error) {
      console.error("Create customer failed:", error);
    }
  }
};

/**
 * 3. PRODUCTS MANAGEMENT
 */
export const productExamples = {
  // Lấy danh sách items
  async getItemsExample() {
    try {
      const response = await getItems({
        page: 1,
        pageSize: 50
      });
      console.log("Items:", response);
      return response;
    } catch (error) {
      console.error("Get items failed:", error);
    }
  },

  // Lấy danh sách product styles
  async getProductStylesExample() {
    try {
      const response = await getProductStyles({
        page: 1,
        pageSize: 20
      });
      console.log("Product styles:", response);
      return response;
    } catch (error) {
      console.error("Get product styles failed:", error);
    }
  }
};

/**
 * 4. ORDERS MANAGEMENT
 */
export const orderExamples = {
  // Lấy danh sách sales orders
  async getSalesOrdersExample() {
    try {
      const response = await getSalesOrders({
        page: 1,
        pageSize: 20,
        status: "CONFIRMED"
      });
      console.log("Sales orders:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get sales orders failed:", error);
    }
  },

  // Tạo sales order mới
  async createSalesOrderExample() {
    try {
      const order = await createSalesOrder({
        orderNo: "SO001",
        customerId: "1",
        orderDate: new Date().toISOString(),
        status: "DRAFT",
        items: [
          {
            lineNo: 1,
            productStyleId: "1",
            itemName: "Product Name",
            uom: "pcs",
            qtyTotal: "100",
            unitPrice: "50000",
            breakdowns: [
              {
                productVariantId: "1",
                qty: "50"
              }
            ]
          }
        ]
      });
      console.log("Created sales order:", order);
      return order;
    } catch (error) {
      console.error("Create sales order failed:", error);
    }
  },

  // Xác nhận sales order
  async confirmSalesOrderExample(id: string) {
    try {
      const order = await confirmSalesOrder(id);
      console.log("Confirmed sales order:", order);
      return order;
    } catch (error) {
      console.error("Confirm sales order failed:", error);
    }
  }
};

/**
 * 5. WAREHOUSE & INVENTORY
 */
export const warehouseExamples = {
  // Lấy danh sách warehouses
  async getWarehousesExample() {
    try {
      const response = await getWarehouses();
      console.log("Warehouses:", response);
      return response;
    } catch (error) {
      console.error("Get warehouses failed:", error);
    }
  },

  // Tạo stock move
  async createStockMoveExample() {
    try {
      const stockMove = await createStockMove({
        moveNo: "SM001",
        moveType: "TRANSFER",
        warehouseId: 1,
        lines: [
          {
            itemId: 1,
            qty: 100,
            fromLocationId: 1,
            toLocationId: 2,
            note: "Move for production"
          }
        ]
      });
      console.log("Created stock move:", stockMove);
      return stockMove;
    } catch (error) {
      console.error("Create stock move failed:", error);
    }
  }
};

/**
 * 6. PRODUCTION MANAGEMENT
 */
export const productionExamples = {
  // Lấy danh sách production orders
  async getProductionOrdersExample() {
    try {
      const response = await getProductionOrders({
        page: 1,
        pageSize: 20,
        status: "RELEASED"
      });
      console.log("Production orders:", response);
      return response;
    } catch (error) {
      console.error("Get production orders failed:", error);
    }
  },

  // Tạo production order
  async createProductionOrderExample() {
    try {
      // Tạo production order
      const order = await createProductionOrder({
        moNo: "MO001",
        productStyleId: 1,
        qtyPlan: 1000,
        status: "DRAFT"
      });

      console.log("Production order created:", order);
      
      return order;
    } catch (error) {
      console.error("Create production order failed:", error);
    }
  }
};

/**
 * 7. RBAC (Role-Based Access Control)
 */
export const rbacExamples = {
  // Tạo role
  async createRoleExample() {
    try {
      // Tạo role
      const role = await createRole({
        code: "PRODUCTION_MANAGER",
        name: "Production Manager",
        description: "Manage production orders and operations"
      });

      console.log("Created role:", role);
      return role;
    } catch (error) {
      console.error("Create role failed:", error);
    }
  }
};

// ===== CUSTOM HOOKS VỚI REACT QUERY =====

/**
 * Custom hooks để sử dụng trong React components
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCustomers = (params?: any) => {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => getCustomers(params || {})
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    }
  });
};

export const useSalesOrders = (params?: any) => {
  return useQuery({
    queryKey: ["sales-orders", params],
    queryFn: () => getSalesOrders(params || {})
  });
};

export const useCreateSalesOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createSalesOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    }
  });
};

export const useConfirmSalesOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id }: { id: string }) => confirmSalesOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    }
  });
};

// Export tất cả examples
export const apiExamples = {
  auth: authExamples,
  customers: customerExamples,
  products: productExamples,
  orders: orderExamples,
  warehouse: warehouseExamples,
  production: productionExamples,
  rbac: rbacExamples
};

export default apiExamples;

