import { InputValidationError } from "errors";
import { CreateUserInput } from "models";
import { UserService } from "services";
import validator from "validator";

export const validateCreateUserInput = async (
  input: any
): Promise<Omit<CreateUserInput, "organizationId">> => {
  const errors: ValidationError[] = [];
  const createUserInput: CreateUserInput = {} as CreateUserInput;

  if (!input.email || !validator.isEmail(input.email)) {
    errors.push({
      field: "email",
      message: "Invalid email. A valid email is required",
    });
  } else {
    const userService = new UserService();
    const existingUser = await userService.getUserByEmail(input.email);
    if (existingUser) {
      errors.push({
        field: "email",
        message: "Email already exists",
      });
    } else {
      createUserInput.email = input.email;
    }
  }

  if (!input.firstName) {
    errors.push({
      field: "firstName",
      message: "First name is required",
    });
  } else {
    createUserInput.firstName = input.firstName;
  }

  if (!input.lastName) {
    errors.push({
      field: "lastName",
      message: "Last name is required",
    });
  } else {
    createUserInput.lastName = input.lastName;
  }

  if (input.avatarUrl) {
    if (!validator.isURL(input.avatarUrl)) {
      errors.push({
        field: "avatarUrl",
        message: "Avatar URL is invalid",
      });
    } else {
      createUserInput.avatarUrl = input.avatarUrl;
    }
  }

  if (input.phoneNumber) {
    if (!validator.isMobilePhone(input.phoneNumber)) {
      errors.push({
        field: "phoneNumber",
        message: "Phone number is invalid",
      });
    } else {
      createUserInput.phoneNumber = input.phoneNumber;
    }
  }

  if (errors.length > 0) {
    throw new InputValidationError(errors);
  }

  return createUserInput;
};
