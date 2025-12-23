import { z } from "zod";
import { zBigInt } from "../../common/zod";

// Helper functions for zod schemas
const zPagination = () => z.coerce.number().int().min(1).max(100).default(1);

// Sales Order DTOs
export const SalesOrderQueryDTO = z.object({
  page: zPagination().optional(),
  limit: zPagination().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  customerId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const SalesOrderItemDTO = z.object({
  productId: z.string(),
  qty: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  lineTotal: z.number().nonnegative(),
  note: z.string().optional(),
});

export const CreateSalesOrderDTO = z.object({
  customerId: z.string(),
  orderType: z.string().default("standard"),
  paymentMethod: z.string().optional(),
  deliveryAddress: z.string().optional(),
  deliveryDate: z.string().optional(),
  currency: z.string().default("VND"),
  items: z.array(SalesOrderItemDTO),
  subtotal: z.number().default(0),
  shippingFee: z.number().default(0),
  discountAmount: z.number().default(0),
  taxEnabled: z.boolean().default(false),
  taxAmount: z.number().default(0),
  total: z.number().default(0),
  status: z.string().default("draft"),
});

export const UpdateSalesOrderDTO = CreateSalesOrderDTO.partial().extend({
  status: z.string().optional(),
});

export const SalesOrderResponseDTO = z.object({
  id: z.string(),
  code: z.string(),
  customerId: z.string(),
  customer: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().optional(),
  }),
  orderType: z.string(),
  paymentMethod: z.string().nullable(),
  deliveryAddress: z.string().nullable(),
  deliveryDate: z.string().nullable(),
  currency: z.string(),
  subtotal: z.number(),
  shippingFee: z.number(),
  discountAmount: z.number(),
  taxEnabled: z.boolean(),
  taxAmount: z.number(),
  total: z.number(),
  status: z.string(),
  createdById: z.string().nullable(),
  createdBy: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
  }).nullable(),
  items: z.array(z.object({
    id: z.string(),
    productId: z.string(),
    product: z.object({
      id: z.string(),
      name: z.string(),
      sku: z.string(),
      unit: z.string().nullable(),
    }),
    qty: z.number(),
    unitPrice: z.number(),
    lineTotal: z.number(),
    note: z.string().nullable(),
  })),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Status transitions
export const SalesOrderStatusDTO = z.object({
  status: z.enum([
    "draft",
    "confirmed", 
    "processing",
    "shipped",
    "delivered",
    "cancelled"
  ]),
  note: z.string().optional(),
});

// Convert to Work Order
export const ConvertToWorkOrderDTO = z.object({
  plannedStart: z.string().optional(),
  plannedEnd: z.string().optional(),
});

// Sales Order Statistics
export const SalesOrderStatsDTO = z.object({
  totalOrders: z.number(),
  totalRevenue: z.number(),
  ordersByStatus: z.array(z.object({
    status: z.string(),
    count: z.number(),
    revenue: z.number(),
  })),
  topCustomers: z.array(z.object({
    customerId: z.string(),
    customerName: z.string(),
    orderCount: z.number(),
    totalRevenue: z.number(),
  })),
});

// Export types
export type SalesOrderQuery = z.infer<typeof SalesOrderQueryDTO>;
export type CreateSalesOrderInput = z.infer<typeof CreateSalesOrderDTO>;
export type UpdateSalesOrderInput = z.infer<typeof UpdateSalesOrderDTO>;
export type SalesOrderResponse = z.infer<typeof SalesOrderResponseDTO>;
export type SalesOrderStatusInput = z.infer<typeof SalesOrderStatusDTO>;
export type ConvertToWorkOrderInput = z.infer<typeof ConvertToWorkOrderDTO>;
export type SalesOrderStats = z.infer<typeof SalesOrderStatsDTO>;

