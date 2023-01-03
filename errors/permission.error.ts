import { CustomError } from "./custom.error";

export class PermissionError extends CustomError {
  statusCode = 403;

  constructor(public details?: string) {
    super("Not Permitted");
    Object.setPrototypeOf(this, PermissionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.details || this.message }];
  }
}
