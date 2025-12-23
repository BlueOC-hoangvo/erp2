import { prisma } from "../../db/prisma";
import { E } from "../../common/errors";
import { writeAuditLog } from "../../common/audit";
import type {
  SalesOrderQuery,
  CreateSalesOrderInput,
  UpdateSalesOrderInput,
  SalesOrderStatusInput,
  ConvertToWorkOrderInput,
  SalesOrderStats,
} from "./sales-orders.dto";

export class SalesOrdersService {
  // Generate order code
  private static async generateOrderCode(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Get last order number for current month
    const lastOrder = await prisma.salesOrder.findFirst({
      where: {
        code: {
          startsWith: `SO-${year}${month}`,
        },
      },
      orderBy: {
        code: 'desc',
      },
    });

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.code.split('-').pop() || '0');
      sequence = lastSequence + 1;
    }

    return `SO-${year}${month}${String(sequence).padStart(4, '0')}`;
  }

  // Calculate totals
  private static calculateTotals(items: Array<{
    qty: number;
    unitPrice: number;
  }>, shippingFee = 0, discountAmount = 0, taxEnabled = false, taxRate = 0.1) {
    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
    const discountedSubtotal = subtotal - discountAmount;
    const taxAmount = taxEnabled ? discountedSubtotal * taxRate : 0;
    const total = discountedSubtotal + shippingFee + taxAmount;

    return {
      subtotal,
      taxAmount,
      total,
    };
  }

  // Get sales orders with filtering and pagination
  static async list(query: SalesOrderQuery) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      customerId,
      dateFrom,
      dateTo,
    } = query;

    const skip = (page - 1) * limit;
    
    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (customerId) {
      where.customerId = BigInt(customerId);
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [orders, total] = await Promise.all([
      prisma.salesOrder.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  unit: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.salesOrder.count({ where }),
    ]);

    return {
      data: orders.map(order => ({
        ...order,
        id: order.id.toString(),
        customerId: order.customerId.toString(),
        createdById: order.createdById?.toString(),
        items: order.items.map(item => ({
          ...item,
          id: item.id.toString(),
          salesOrderId: item.salesOrderId.toString(),
          productId: item.productId.toString(),
        })),
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single sales order
  static async getById(id: string) {
    const order = await prisma.salesOrder.findFirst({
      where: {
        id: BigInt(id),
        deletedAt: null,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                unit: true,
                salePrice: true,
              },
            },
          },
          orderBy: {
            id: 'asc',
          },
        },
      },
    });

    if (!order) {
      throw E.notFound("Sales order not found");
    }

    return {
      ...order,
      id: order.id.toString(),
      customerId: order.customerId.toString(),
      createdById: order.createdById?.toString(),
      items: order.items.map(item => ({
        ...item,
        id: item.id.toString(),
        salesOrderId: item.salesOrderId.toString(),
        productId: item.productId.toString(),
      })),
    };
  }

  // Create sales order
  static async create(input: CreateSalesOrderInput, userId?: string) {
    const {
      customerId,
      orderType,
      paymentMethod,
      deliveryAddress,
      deliveryDate,
      currency,
      items,
      subtotal,
      shippingFee,
      discountAmount,
      taxEnabled,
      taxAmount,
      total,
      status,
    } = input;

    // Verify customer exists
    const customer = await prisma.customer.findFirst({
      where: {
        id: BigInt(customerId),
        deletedAt: null,
      },
    });

    if (!customer) {
      throw E.badRequest("Customer not found");
    }

    // Verify products exist and calculate totals
    const productIds = items.map(item => BigInt(item.productId));
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        deletedAt: null,
      },
    });

    if (products.length !== items.length) {
      throw E.badRequest("Some products not found");
    }

    // Calculate totals
    const calculatedTotals = this.calculateTotals(
      items,
      shippingFee,
      discountAmount,
      taxEnabled
    );

    // Generate order code
    const code = await this.generateOrderCode();

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.salesOrder.create({
        data: {
          code,
          customerId: BigInt(customerId),
          orderType,
          paymentMethod,
          deliveryAddress,
          deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
          currency,
          subtotal: calculatedTotals.subtotal,
          shippingFee,
          discountAmount,
          taxEnabled,
          taxAmount: calculatedTotals.taxAmount,
          total: calculatedTotals.total,
          status,
          createdById: userId ? BigInt(userId) : null,
        },
      });

      // Create order items
      await tx.salesOrderItem.createMany({
        data: items.map(item => ({
          salesOrderId: newOrder.id,
          productId: BigInt(item.productId),
          qty: item.qty,
          unitPrice: item.unitPrice,
          lineTotal: item.qty * item.unitPrice,
          note: item.note,
        })),
      });

      return newOrder;
    });

    // Write audit log
    await writeAuditLog({
      actorUserId: userId ? BigInt(userId) : null,
      action: "sales_order.create",
      entityType: "SalesOrder",
      entityId: order.id,
      afterJson: order,
    });

    return this.getById(order.id.toString());
  }

  // Update sales order
  static async update(id: string, input: UpdateSalesOrderInput, userId?: string) {
    const order = await prisma.salesOrder.findFirst({
      where: {
        id: BigInt(id),
        deletedAt: null,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw E.notFound("Sales order not found");
    }

    // Check if order can be updated (not shipped or delivered)
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      throw E.badRequest("Cannot update order in current status");
    }

    const {
      customerId,
      orderType,
      paymentMethod,
      deliveryAddress,
      deliveryDate,
      currency,
      items,
      subtotal,
      shippingFee,
      discountAmount,
      taxEnabled,
      taxAmount,
      total,
      status,
    } = input;

    let calculatedTotals = { subtotal, taxAmount, total };
    
    // Recalculate totals if items are provided
    if (items) {
      calculatedTotals = this.calculateTotals(
        items,
        shippingFee || 0,
        discountAmount || 0,
        taxEnabled || false
      );
    }

    // Update order in transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order
      const updated = await tx.salesOrder.update({
        where: { id: BigInt(id) },
        data: {
          ...(customerId && { customerId: BigInt(customerId) }),
          ...(orderType && { orderType }),
          ...(paymentMethod !== undefined && { paymentMethod }),
          ...(deliveryAddress !== undefined && { deliveryAddress }),
          ...(deliveryDate !== undefined && { deliveryDate: deliveryDate ? new Date(deliveryDate) : null }),
          ...(currency && { currency }),
          ...(calculatedTotals.subtotal !== undefined && { subtotal: calculatedTotals.subtotal }),
          ...(shippingFee !== undefined && { shippingFee }),
          ...(discountAmount !== undefined && { discountAmount }),
          ...(taxEnabled !== undefined && { taxEnabled }),
          ...(calculatedTotals.taxAmount !== undefined && { taxAmount: calculatedTotals.taxAmount }),
          ...(calculatedTotals.total !== undefined && { total: calculatedTotals.total }),
          ...(status && { status }),
        },
      });

      // Update items if provided
      if (items) {
        // Delete existing items
        await tx.salesOrderItem.deleteMany({
          where: { salesOrderId: BigInt(id) },
        });

        // Create new items
        await tx.salesOrderItem.createMany({
          data: items.map(item => ({
            salesOrderId: BigInt(id),
            productId: BigInt(item.productId),
            qty: item.qty,
            unitPrice: item.unitPrice,
            lineTotal: item.qty * item.unitPrice,
            note: item.note,
          })),
        });
      }

      return updated;
    });

    // Write audit log
    await writeAuditLog({
      actorUserId: userId ? BigInt(userId) : null,
      action: "sales_order.update",
      entityType: "SalesOrder",
      entityId: BigInt(id),
      beforeJson: order,
      afterJson: updatedOrder,
    });

    return this.getById(id);
  }

  // Update order status
  static async updateStatus(id: string, input: SalesOrderStatusInput, userId?: string) {
    const order = await prisma.salesOrder.findFirst({
      where: {
        id: BigInt(id),
        deletedAt: null,
      },
    });

    if (!order) {
      throw E.notFound("Sales order not found");
    }

    const { status, note } = input;

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      draft: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: [],
      cancelled: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw E.badRequest(`Cannot transition from ${order.status} to ${status}`);
    }

    const updatedOrder = await prisma.salesOrder.update({
      where: { id: BigInt(id) },
      data: { status },
    });

    // Write audit log
    await writeAuditLog({
      actorUserId: userId ? BigInt(userId) : null,
      action: "sales_order.status_change",
      entityType: "SalesOrder",
      entityId: BigInt(id),
      metadata: { fromStatus: order.status, toStatus: status, note },
    });

    return this.getById(id);
  }

  // Delete sales order (soft delete)
  static async delete(id: string, userId?: string) {
    const order = await prisma.salesOrder.findFirst({
      where: {
        id: BigInt(id),
        deletedAt: null,
      },
    });

    if (!order) {
      throw E.notFound("Sales order not found");
    }

    // Cannot delete orders that are in progress
    if (['confirmed', 'processing', 'shipped'].includes(order.status)) {
      throw E.badRequest("Cannot delete order in current status");
    }

    await prisma.salesOrder.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date() },
    });

    // Write audit log
    await writeAuditLog({
      actorUserId: userId ? BigInt(userId) : null,
      action: "sales_order.delete",
      entityType: "SalesOrder",
      entityId: BigInt(id),
      beforeJson: order,
    });

    return { success: true };
  }

  // Get statistics
  static async getStats(dateFrom?: string, dateTo?: string): Promise<SalesOrderStats> {
    const where: any = {
      deletedAt: null,
    };

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [totalOrders, ordersByStatus, topCustomers] = await Promise.all([
      prisma.salesOrder.count({ where }),
      
      prisma.salesOrder.groupBy({
        by: ['status'],
        where,
        _count: { status: true },
        _sum: { total: true },
      }),
      
      prisma.salesOrder.groupBy({
        by: ['customerId'],
        where: {
          ...where,
          status: { in: ['confirmed', 'processing', 'shipped', 'delivered'] },
        },
        _count: { customerId: true },
        _sum: { total: true },
        orderBy: {
          _sum: {
            total: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    const totalRevenue = ordersByStatus.reduce(
      (sum, item) => sum + (Number(item._sum.total) || 0),
      0
    );

    const customers = await prisma.customer.findMany({
      where: {
        id: { in: topCustomers.map(c => c.customerId) },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const customerMap = new Map(customers.map(c => [c.id.toString(), c.name]));

    return {
      totalOrders,
      totalRevenue,
      ordersByStatus: ordersByStatus.map(item => ({
        status: item.status,
        count: item._count.status,
        revenue: Number(item._sum.total) || 0,
      })),
      topCustomers: topCustomers.map(item => ({
        customerId: item.customerId.toString(),
        customerName: customerMap.get(item.customerId.toString()) || 'Unknown',
        orderCount: item._count.customerId,
        totalRevenue: Number(item._sum.total) || 0,
      })),
    };
  }

  // Convert to work order
  static async convertToWorkOrder(id: string, input: ConvertToWorkOrderInput, userId?: string) {
    const order = await prisma.salesOrder.findFirst({
      where: {
        id: BigInt(id),
        deletedAt: null,
        status: { in: ['confirmed', 'processing'] },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw E.notFound("Sales order not found or cannot convert");
    }

    // Generate work order code
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    const lastWorkOrder = await prisma.workOrder.findFirst({
      where: {
        code: {
          startsWith: `WO-${year}${month}`,
        },
      },
      orderBy: {
        code: 'desc',
      },
    });

    let sequence = 1;
    if (lastWorkOrder) {
      const lastSequence = parseInt(lastWorkOrder.code.split('-').pop() || '0');
      sequence = lastSequence + 1;
    }

    const workOrderCode = `WO-${year}${month}${String(sequence).padStart(4, '0')}`;

    // Check if order has items
    if (!order.items || order.items.length === 0) {
      throw E.badRequest("Order must have at least one item to convert to work order");
    }

    // Create work order
    const workOrder = await prisma.$transaction(async (tx) => {
      const wo = await tx.workOrder.create({
        data: {
          code: workOrderCode,
          salesOrderId: order.id,
          productId: order.items[0].productId, // For now, use first product
          qty: order.items.reduce((sum, item) => sum + item.qty, 0),
          plannedStart: input.plannedStart ? new Date(input.plannedStart) : null,
          plannedEnd: input.plannedEnd ? new Date(input.plannedEnd) : null,
          status: 'planned',
        },
      });

      // Create default work order step
      await tx.workOrderStep.create({
        data: {
          workOrderId: wo.id,
          stepNo: 1,
          name: 'Production',
          status: 'todo',
        },
      });

      return wo;
    });

    // Write audit log
    await writeAuditLog({
      actorUserId: userId ? BigInt(userId) : null,
      action: "sales_order.convert_to_workorder",
      entityType: "SalesOrder",
      entityId: BigInt(id),
      metadata: { workOrderId: workOrder.id.toString() },
    });

    return {
      workOrderId: workOrder.id.toString(),
      workOrderCode: workOrder.code,
    };
  }
}

