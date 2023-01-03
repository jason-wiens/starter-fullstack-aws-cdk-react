import { InputValidationError } from "errors";
import { UpdateOrganizationInput } from "models";
import validator from "validator";

export const validateUpdateOrganizationInput = async (
  input: any
): Promise<UpdateOrganizationInput> => {
  const errors: ValidationError[] = [];
  const updateOrganizationInput = {} as UpdateOrganizationInput;

  if (input.legalName) {
    updateOrganizationInput.legalName = input.legalName;
  }

  if (input.displayName) {
    updateOrganizationInput.displayName = input.displayName;
  }

  if (input.logoUrl) {
    if (!validator.isURL(input.logoUrl)) {
      errors.push({
        field: "logoUrl",
        message: "Avatar URL is invalid",
      });
    } else {
      updateOrganizationInput.logoUrl = input.logoUrl;
    }
  }

  if (input.address) {
    updateOrganizationInput.address = input.address;
  }

  if (input.city) {
    updateOrganizationInput.city = input.city;
  }

  if (input.province) {
    updateOrganizationInput.province = input.province;
  }

  if (input.postalCode) {
    updateOrganizationInput.postalCode = input.postalCode;
  }

  if (errors.length > 0) {
    throw new InputValidationError(errors);
  }

  return updateOrganizationInput;
};
