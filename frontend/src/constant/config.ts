export const APP_NAME = "ERP Admin";

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const APP_CONFIG = {
  name: APP_NAME,
  version: "1.0.0",
  description: "Enterprise Resource Planning System",
};

