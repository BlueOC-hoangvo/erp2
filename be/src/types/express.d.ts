import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    validated?: {
      body?: any;
      params?: any;
      query?: any;
    };
    user?: {
      id: bigint;
      email: string;
      fullName: string;
    };
  }
}
