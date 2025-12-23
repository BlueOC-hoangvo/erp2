import { Router } from "express";
import { auth } from "../../middleware/auth";
import { permit } from "../../middleware/permit";
import { validate } from "../../middleware/validate";
import { ProductsController } from "./products.controller";
import { CreateProductSchema, UpdateProductSchema, ProductQuerySchema } from "./products.dto";

export function productsRoutes() {
  const r = Router();

  // GET /products - List products with pagination and search
  r.get(
    "/",
    auth,
    permit("product.read"),
    validate(ProductQuerySchema, "query"),
    ProductsController.list
  );

  // GET /products/:id - Get product by ID
  r.get(
    "/:id",
    auth,
    permit("product.read"),
    ProductsController.getById
  );

  // POST /products - Create new product
  r.post(
    "/",
    auth,
    permit("product.write"),
    validate(CreateProductSchema, "body"),
    ProductsController.create
  );

  // PUT /products/:id - Update product
  r.put(
    "/:id",
    auth,
    permit("product.write"),
    validate(UpdateProductSchema, "body"),
    ProductsController.update
  );

  // DELETE /products/:id - Soft delete product
  r.delete(
    "/:id",
    auth,
    permit("product.write"),
    ProductsController.delete
  );

  return r;
}
