import client from "client/utils/axios.utils";
import validator from "validator";
import {
  CreateUserRequestBody,
  CreateUserResponseBody,
  createUserRoute,
} from "client/routes/api/user.routes";

export type CreateUserFormFields = {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
};

const validateCreateUserForm: FormValidationFn<CreateUserFormFields> = (
  formData
) => {
  const errors: FormErrors<CreateUserFormFields> = {
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    general: "",
  };
  let isErrors = false;

  if (formData.firstName.length < 3) {
    errors.firstName = "First name must be at least 3 characters";
    isErrors = true;
  }

  if (formData.lastName.length < 3) {
    errors.lastName = "Last name must be at least 3 characters";
    isErrors = true;
  }

  if (!validator.isEmail(formData.email)) {
    errors.email = "Email is invalid";
    isErrors = true;
  }

  if (formData.email !== formData.confirmEmail) {
    errors.confirmEmail = "Emails must match";
    isErrors = true;
  }

  if (isErrors) {
    return errors;
  }

  return null;
};

export const createUserAction: FormActionFn<
  CreateUserFormFields,
  CreateUserResponseBody
> = async (formData) => {
  const errors = validateCreateUserForm(formData);
  if (errors) {
    return {
      status: "error",
      errors,
    };
  }

  const url = createUserRoute.path(process.env.REACT_APP_API_ENDPOINT!);
  const method = createUserRoute.method;
  const data: CreateUserRequestBody = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
  };

  try {
    const response = await client.request<CreateUserResponseBody>({
      url,
      method,
      data,
    });

    if (response.status === 201) {
      return {
        status: "success",
        data: response.data,
      };
    } else {
      console.log(response);
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      errors: {
        general: "Something went wrong. Please try again later.",
      },
    };
  }
};
