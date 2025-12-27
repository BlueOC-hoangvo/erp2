// Sales Orders Utilities - Data Mappers and Helpers
import type { 
  SalesOrder, 
  SalesOrderItem
} from "../types";

import { 
  SALES_ORDER_STATUS_COLORS,
  SALES_ORDER_STATUS_LABELS 
} from "../types";

// Format currency values từ decimal string
export function formatCurrency(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(numValue);
}

// Format date values
export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('vi-VN');
}

// Format datetime values
export function formatDateTime(dateString: string): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('vi-VN');
}

// Convert decimal string to number
export function parseDecimal(value: string): number {
  return parseFloat(value) || 0;
}

// Calculate item total amount
export function calculateItemTotal(item: SalesOrderItem): number {
  const qty = parseDecimal(item.qtyTotal);
  const price = parseDecimal(item.unitPrice);
  return qty * price;
}

// Calculate order total amount
export function calculateOrderTotal(order: SalesOrder): number {
  return order.items.reduce((total, item) => total + calculateItemTotal(item), 0);
}

// Get status color
export function getStatusColor(status: string): string {
  return SALES_ORDER_STATUS_COLORS[status as keyof typeof SALES_ORDER_STATUS_COLORS] || 'default';
}

// Get status label
export function getStatusLabel(status: string): string {
  return SALES_ORDER_STATUS_LABELS[status as keyof typeof SALES_ORDER_STATUS_LABELS] || status;
}

// Convert API response to table format
export function convertToTableRow(order: SalesOrder) {
  return {
    key: order.id,
    orderNo: order.orderNo,
    customerName: order.customer?.name || 'N/A',
    orderDate: formatDate(order.orderDate),
    dueDate: order.dueDate ? formatDate(order.dueDate) : '-',
    status: order.status,
    statusLabel: getStatusLabel(order.status),
    totalAmount: formatCurrency(order.totalAmount),
    rawTotalAmount: parseDecimal(order.totalAmount),
    actions: 'actions',
  };
}

// Convert API response to form format
export function convertToFormData(order: SalesOrder) {
  return {
    orderNo: order.orderNo,
    customerId: order.customerId,
    orderDate: order.orderDate,
    dueDate: order.dueDate || '',
    note: order.note || '',
    isInternal: order.isInternal,
    items: order.items.map(item => ({
      lineNo: item.lineNo,
      productStyleId: item.productStyleId,
      itemName: item.itemName,
      uom: item.uom,
      qtyTotal: item.qtyTotal,
      unitPrice: item.unitPrice,
      note: item.note || '',
      breakdowns: item.breakdowns?.map(bd => ({
        productVariantId: bd.productVariantId,
        qty: bd.qty,
      })) || [],
    })),
  };
}

// Convert form data to API request format
export function convertFormToApiRequest(formData: any) {
  return {
    orderNo: formData.orderNo,
    customerId: formData.customerId,
    orderDate: formData.orderDate || undefined,
    dueDate: formData.dueDate || undefined,
    note: formData.note || undefined,
    isInternal: formData.isInternal || false,
    items: formData.items.map((item: any) => ({
      lineNo: item.lineNo,
      productStyleId: item.productStyleId,
      itemName: item.itemName,
      uom: item.uom || 'pcs',
      qtyTotal: item.qtyTotal.toString(),
      unitPrice: item.unitPrice.toString(),
      note: item.note || undefined,
      breakdowns: item.breakdowns?.filter((bd: any) => bd.productVariantId && bd.qty) || [],
    })),
  };
}

// Validate sales order data
export function validateSalesOrder(data: any): string[] {
  const errors: string[] = [];

  if (!data.orderNo?.trim()) {
    errors.push('Mã đơn hàng là bắt buộc');
  }

  if (!data.customerId) {
    errors.push('Khách hàng là bắt buộc');
  }

  if (!data.items || data.items.length === 0) {
    errors.push('Phải có ít nhất một sản phẩm');
  }

  if (data.items) {
    data.items.forEach((item: any, index: number) => {
      if (!item.productStyleId) {
        errors.push(`Sản phẩm dòng ${index + 1} là bắt buộc`);
      }
      if (!item.itemName?.trim()) {
        errors.push(`Tên sản phẩm dòng ${index + 1} là bắt buộc`);
      }
      if (!item.qtyTotal || parseFloat(item.qtyTotal) <= 0) {
        errors.push(`Số lượng dòng ${index + 1} phải > 0`);
      }
      if (!item.unitPrice || parseFloat(item.unitPrice) < 0) {
        errors.push(`Đơn giá dòng ${index + 1} không hợp lệ`);
      }
    });
  }

  return errors;
}

// Generate line numbers for items
export function generateLineNumbers(count: number): number[] {
  return Array.from({ length: count }, (_, i) => i + 1);
}

// Sort orders by field
export function sortOrders(orders: SalesOrder[], sortBy: string, sortOrder: 'asc' | 'desc') {
  return [...orders].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'orderDate':
        aValue = new Date(a.orderDate);
        bValue = new Date(b.orderDate);
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      default:
        aValue = a.orderNo;
        bValue = b.orderNo;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

// Filter orders
export function filterOrders(orders: SalesOrder[], filters: any) {
  return orders.filter(order => {
    // Search by order number or customer name
    if (filters.q) {
      const searchTerm = filters.q.toLowerCase();
      const matchesOrderNo = order.orderNo.toLowerCase().includes(searchTerm);
      const matchesCustomerName = order.customer?.name?.toLowerCase().includes(searchTerm);
      if (!matchesOrderNo && !matchesCustomerName) return false;
    }

    // Filter by customer
    if (filters.customerId && order.customerId !== filters.customerId) {
      return false;
    }

    // Filter by status
    if (filters.status && order.status !== filters.status) {
      return false;
    }

    // Filter by date range
    if (filters.fromDate) {
      const orderDate = new Date(order.orderDate);
      const fromDate = new Date(filters.fromDate);
      if (orderDate < fromDate) return false;
    }

    if (filters.toDate) {
      const orderDate = new Date(order.orderDate);
      const toDate = new Date(filters.toDate);
      if (orderDate > toDate) return false;
    }

    return true;
  });
}
