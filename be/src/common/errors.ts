export class AppError extends Error {
  status: number;
  details?: any;
  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const E = {
  badRequest: (msg: string, details?: any) => new AppError(400, msg, details),
  unauthorized: (msg = "Unauthorized") => new AppError(401, msg),
  forbidden: (msg = "Forbidden") => new AppError(403, msg),
  notFound: (msg = "Not found") => new AppError(404, msg),
  conflict: (msg = "Conflict") => new AppError(409, msg),
};

//chuẩn hóa cách xử lí lỗi ở backend
