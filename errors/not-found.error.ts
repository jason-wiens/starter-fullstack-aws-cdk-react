import { CustomError } from "./custom.error";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public details?: string) {
    super("Not Found");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.details || this.message }];
  }
}
