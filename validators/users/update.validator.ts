import { InputValidationError } from "errors";
import { UpdateUserInput } from "models";
import validator from "validator";

export const validateUpdateUserInput = (input: any): UpdateUserInput => {
  const errors: ValidationError[] = [];
  const updateUserInput: UpdateUserInput = {};

  if (!input.firstName) {
    errors.push({
      field: "firstName",
      message: "First name is required",
    });
  } else {
    updateUserInput.firstName = input.firstName;
  }

  if (!input.lastName) {
    errors.push({
      field: "lastName",
      message: "Last name is required",
    });
  } else {
    updateUserInput.lastName = input.lastName;
  }

  if (input.avatarUrl) {
    if (!validator.isURL(input.avatarUrl)) {
      errors.push({
        field: "avatarUrl",
        message: "Avatar URL is invalid",
      });
    } else {
      updateUserInput.avatarUrl = input.avatarUrl;
    }
  }

  if (input.phoneNumber) {
    if (!validator.isMobilePhone(input.phoneNumber)) {
      errors.push({
        field: "phoneNumber",
        message: "Phone number is invalid",
      });
    } else {
      updateUserInput.phoneNumber = input.phoneNumber;
    }
  }

  if (errors.length > 0) {
    throw new InputValidationError(errors);
  }

  return updateUserInput;
};
