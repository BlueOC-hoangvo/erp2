import { Request, Response } from "express";
import { SalesOrdersService } from "./sales-orders.service";
import { 
  SalesOrderQueryDTO, 
  CreateSalesOrderDTO, 
  UpdateSalesOrderDTO, 
  SalesOrderStatusDTO,
  ConvertToWorkOrderDTO
} from "./sales-orders.dto";
import type { AuthedRequest } from "../../middleware/auth";
import { E } from "../../common/errors";

export class SalesOrdersController {
  // GET /sales-orders - Danh sách đơn hàng
  static async list(req: AuthedRequest, res: Response) {
    try {
      const query = SalesOrderQueryDTO.parse(req.query);
      const result = await SalesOrdersService.list(query);
      
      res.json({
        data: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw E.badRequest(error.message);
      }
      throw error;
    }
  }

  // GET /sales-orders/:id - Chi tiết đơn hàng
  static async getById(req: AuthedRequest, res: Response) {
    try {
      const { id } = req.params;
      const order = await SalesOrdersService.getById(id);
      
      res.json({ data: order });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        throw E.notFound("Sales order not found");
      }
      throw error;
    }
  }

  // POST /sales-orders - Tạo đơn hàng mới
  static async create(req: AuthedRequest, res: Response) {
    try {
      const input = CreateSalesOrderDTO.parse(req.body);
      const userId = req.user?.id.toString();
      
      const order = await SalesOrdersService.create(input, userId);
      
      res.status(201).json({ 
        data: order,
        message: "Sales order created successfully" 
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw E.badRequest(error.message);
      }
      if (error.message.includes("not found")) {
        throw E.badRequest(error.message);
      }
      throw error;
    }
  }

  // PUT /sales-orders/:id - Cập nhật đơn hàng
  static async update(req: AuthedRequest, res: Response) {
    try {
      const { id } = req.params;
      const input = UpdateSalesOrderDTO.parse(req.body);
      const userId = req.user?.id.toString();
      
      const order = await SalesOrdersService.update(id, input, userId);
      
      res.json({ 
        data: order,
        message: "Sales order updated successfully" 
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw E.badRequest(error.message);
      }
      if (error.message.includes("not found")) {
        throw E.notFound("Sales order not found");
      }
      if (error.message.includes("Cannot update")) {
        throw E.badRequest(error.message);
      }
      throw error;
    }
  }

  // PATCH /sales-orders/:id/status - Cập nhật trạng thái đơn hàng
  static async updateStatus(req: AuthedRequest, res: Response) {
    try {
      const { id } = req.params;
      const input = SalesOrderStatusDTO.parse(req.body);
      const userId = req.user?.id.toString();
      
      const order = await SalesOrdersService.updateStatus(id, input, userId);
      
      res.json({ 
        data: order,
        message: `Order status updated to ${input.status}` 
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw E.badRequest(error.message);
      }
      if (error.message.includes("not found")) {
        throw E.notFound("Sales order not found");
      }
      if (error.message.includes("Cannot transition")) {
        throw E.badRequest(error.message);
      }
      throw error;
    }
  }

  // DELETE /sales-orders/:id - Xóa đơn hàng (soft delete)
  static async delete(req: AuthedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id.toString();
      
      await SalesOrdersService.delete(id, userId);
      
      res.json({ 
        message: "Sales order deleted successfully" 
      });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        throw E.notFound("Sales order not found");
      }
      if (error.message.includes("Cannot delete")) {
        throw E.badRequest(error.message);
      }
      throw error;
    }
  }

  // GET /sales-orders/stats - Thống kê đơn hàng
  static async getStats(req: AuthedRequest, res: Response) {
    try {
      const { dateFrom, dateTo } = req.query;
      
      const stats = await SalesOrdersService.getStats(
        dateFrom as string | undefined,
        dateTo as string | undefined
      );
      
      res.json({ data: stats });
    } catch (error: any) {
      throw error;
    }
  }

  // POST /sales-orders/:id/convert-to-workorder - Chuyển đơn hàng thành work order
  static async convertToWorkOrder(req: AuthedRequest, res: Response) {
    try {
      const { id } = req.params;
      const input = ConvertToWorkOrderDTO.parse(req.body);
      const userId = req.user?.id.toString();
      
      const result = await SalesOrdersService.convertToWorkOrder(id, input, userId);
      
      res.json({ 
        data: result,
        message: `Order converted to work order ${result.workOrderCode}` 
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw E.badRequest(error.message);
      }
      if (error.message.includes("not found") || error.message.includes("cannot convert")) {
        throw E.badRequest(error.message);
      }
      if (error.message.includes("must have at least one item")) {
        throw E.badRequest(error.message);
      }
      throw error;
    }
  }

  // GET /sales-orders/:id/items - Lấy items của đơn hàng
  static async getItems(req: AuthedRequest, res: Response) {
    try {
      const { id } = req.params;
      const order = await SalesOrdersService.getById(id);
      
      res.json({ data: order.items });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        throw E.notFound("Sales order not found");
      }
      throw error;
    }
  }
}

