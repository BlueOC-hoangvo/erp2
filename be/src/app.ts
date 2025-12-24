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
import { customersRoutes } from "./modules/customers/customers.routes";
import { filesRoutes } from "./modules/files/files.routes";
import { auditRoutes } from "./modules/audit/audit.routes";
import { statusRoutes } from "./modules/status/status.routes";

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
  app.use("/customers", customersRoutes());
  app.use("/files", filesRoutes());
  app.use("/audit-logs", auditRoutes());
  app.use("/status", statusRoutes());

  app.use(errorHandler);
  return app;
}
