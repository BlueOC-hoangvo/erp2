import { Request, Response } from "express";
import { productsService } from "./products.service";
import { CreateProductSchema, UpdateProductSchema, ProductQuerySchema } from "./products.dto";
import { ok } from "../../common/response";

class ProductsController {
  static async list(req: Request, res: Response) {
    const query = ProductQuerySchema.parse(req.query);
    const result = await productsService.list(query);
    ok(res, result.data, result.meta);
  }

  static async getById(req: Request, res: Response) {
    const idStr = req.params.id;
    if (!idStr) throw new Error("ID is required");
    const id = BigInt(idStr);
    const product = await productsService.getById(id);
    ok(res, product);
  }

  static async create(req: Request, res: Response) {
    const input = CreateProductSchema.parse(req.body);
    const product = await productsService.create(input);
    ok(res, product);
  }

  static async update(req: Request, res: Response) {
    const idStr = req.params.id;
    if (!idStr) throw new Error("ID is required");
    const id = BigInt(idStr);
    const input = UpdateProductSchema.parse(req.body);
    const product = await productsService.update(id, input);
    ok(res, product);
  }

  static async delete(req: Request, res: Response) {
    const idStr = req.params.id;
    if (!idStr) throw new Error("ID is required");
    const id = BigInt(idStr);
    const product = await productsService.delete(id);
    ok(res, product);
  }
}

export { ProductsController };
