export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  code?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number = 500, code: string = "INTERNAL_SERVER_ERROR", errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static fromError(err: unknown): ApiError {
    if (err instanceof ApiError) {
      return err;
    }
    if (err instanceof Error) {
      return new ApiError(err.message, 500, "UNKNOWN_ERROR");
    }
    return new ApiError("An unexpected error occurred", 500, "UNKNOWN_ERROR");
  }
}
