import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";

import { authRoutes } from "./modules/auth/auth.routes";
import { meRoutes } from "./modules/me/me.route";
import customersRoutes from "./modules/customers/customers.routes";



import { usersRoutes } from "./modules/users/users.routes";
import { rolesRoutes } from "./modules/roles/roles.routes";
import { permissionsRoutes } from "./modules/permissions/permissions.routes";

import suppliersRoutes from "./modules/suppliers/suppliers.routes";
import itemsRoutes from "./modules/items/items.routes";

import productStylesRoutes from "./modules/product-styles/productStyles.routes";
import sizesRoutes from "./modules/sizes/sizes.routes";
import colorsRoutes from "./modules/colors/colors.routes";
import productVariantsRoutes from "./modules/product-variants/productVariants.routes";

import locationsRoutes from "./modules/locations/locations.routes";
import stockMovesRoutes from "./modules/stock-moves/stockMoves.routes";

import warehousesRoutes from "./modules/warehouses/warehouses.routes"
import inventoryRoutes from "./modules/inventory/inventory.routes";
import salesOrdersRoutes from "./modules/sales-orders/salesOrders.routes";
import purchaseOrdersRoutes from "./modules/purchase-orders/purchaseOrders.routes";
import productionOrdersRoutes from "./modules/production-orders/productionOrders.routes";

import bomsRoutes from "./modules/boms/boms.routes";



export function buildApp() {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json({ limit: "2mb" }));

  // uploads static serve (dev)
  if (!fs.existsSync(env.UPLOAD_DIR))
    fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
  app.use("/uploads", express.static(path.resolve(env.UPLOAD_DIR)));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/auth", authRoutes());
  app.use("/", meRoutes());



  
  app.use("/suppliers", suppliersRoutes);
  app.use("/items", itemsRoutes);
  

  app.use("/users", usersRoutes());

  app.use("/roles", rolesRoutes());
  app.use("/permissions", permissionsRoutes());

  app.use("/customers", customersRoutes);

  app.use("/product-styles", productStylesRoutes);
app.use("/sizes", sizesRoutes);
app.use("/colors", colorsRoutes);
app.use("/product-variants", productVariantsRoutes);
app.use("/locations", locationsRoutes);
app.use("/stock-moves", stockMovesRoutes);
app.use("/warehouses", warehousesRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/sales-orders", salesOrdersRoutes);
app.use("/purchase-orders", purchaseOrdersRoutes);
app.use("/production-orders", productionOrdersRoutes);
app.use("/boms", bomsRoutes);
  app.use(errorHandler);
  return app;
}
