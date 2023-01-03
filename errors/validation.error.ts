import { CustomError } from "./custom.error";

export class InputValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Bad Request");
    Object.setPrototypeOf(this, InputValidationError.prototype);
  }

  serializeErrors() {
    return this.errors;
  }
}
