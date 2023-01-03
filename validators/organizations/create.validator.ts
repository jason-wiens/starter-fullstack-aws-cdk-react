import { InputValidationError } from "errors";
import { CreateOrganizationInput } from "models";
import validator from "validator";

export const validateCreateOrganizationInput = async (
  input: any
): Promise<CreateOrganizationInput> => {
  const errors: ValidationError[] = [];
  const createOrganizationInput = {} as CreateOrganizationInput;

  if (!input.legalName) {
    errors.push({
      field: "legalName",
      message: "The organization's full legal name is required",
    });
  } else {
    createOrganizationInput.legalName = input.legalName;
  }

  if (!input.displayName) {
    errors.push({
      field: "displayName",
      message: "A display name for the organization is required",
    });
  } else {
    createOrganizationInput.displayName = input.displayName;
  }

  if (input.logoUrl) {
    if (!validator.isURL(input.logoUrl)) {
      errors.push({
        field: "logoUrl",
        message: "Avatar URL is invalid",
      });
    } else {
      createOrganizationInput.logoUrl = input.logoUrl;
    }
  }

  if (!input.address) {
    errors.push({
      field: "address",
      message: "The Organization's address is required",
    });
  } else {
    createOrganizationInput.address = input.address;
  }

  if (!input.city) {
    errors.push({
      field: "city",
      message: "The Organization's city is required",
    });
  } else {
    createOrganizationInput.city = input.city;
  }

  if (!input.province) {
    errors.push({
      field: "province",
      message: "The Organization's province is required",
    });
  } else {
    createOrganizationInput.province = input.province;
  }

  if (!input.postalCode) {
    errors.push({
      field: "postalCode",
      message: "The Organization's postal code is required",
    });
  } else {
    createOrganizationInput.postalCode = input.postalCode;
  }

  if (errors.length > 0) {
    throw new InputValidationError(errors);
  }

  return createOrganizationInput;
};
