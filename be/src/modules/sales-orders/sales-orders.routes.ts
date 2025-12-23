import { Router } from "express";
import { SalesOrdersController } from "./sales-orders.controller";
import { auth } from "../../middleware/auth";
import { permit } from "../../middleware/permit";

const router = Router();

// Apply authentication to all routes
router.use(auth);

// Sales Orders CRUD routes
router.get(
  "/",
  permit("sales_order_read"),
  SalesOrdersController.list
);

router.get(
  "/stats",
  permit("sales_order_read"),
  SalesOrdersController.getStats
);

router.get(
  "/:id",
  permit("sales_order_read"),
  SalesOrdersController.getById
);

router.get(
  "/:id/items",
  permit("sales_order_read"),
  SalesOrdersController.getItems
);

router.post(
  "/",
  permit("sales_order_create"),
  SalesOrdersController.create
);

router.put(
  "/:id",
  permit("sales_order_update"),
  SalesOrdersController.update
);

router.patch(
  "/:id/status",
  permit("sales_order_update"),
  SalesOrdersController.updateStatus
);

router.delete(
  "/:id",
  permit("sales_order_delete"),
  SalesOrdersController.delete
);

// Convert to Work Order
router.post(
  "/:id/convert-to-workorder",
  permit("sales_order_convert"),
  SalesOrdersController.convertToWorkOrder
);

export const salesOrdersRoutes = router;

