import { CustomError } from "./custom.error";

export class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor(public details?: string) {
    super("Not Authorized");
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.details || this.message }];
  }
}
