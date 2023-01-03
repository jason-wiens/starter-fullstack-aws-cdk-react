import {
  CreateOrganizationInput,
  UpdateOrganizationInput,
  CreateUserInput,
  Organization,
  User,
} from "models";

// Create New Organization
//
// Path: {baseURL}/orgs
// Method: POST

export const createOrganizationRoute = {
  path: (baseURL: string) => `${baseURL}/orgs`,
  method: "POST",
};

export type CreateOrganizationRequestBody = {
  organization: CreateOrganizationInput;
  adminUser: CreateUserInput;
};

export type CreateOrganizationResponseBody = {
  organization: Organization;
  adminUser: User;
};

// Get current user's organization
//
// Path: {baseURL}/org
// Method: GET

export const getMyOrganizationRoute = {
  path: (baseURL: string) => `${baseURL}/org`,
  method: "GET",
};

export type GetMyOrganizationResponseBody = {
  organization: Organization;
};

// Get all organizations
//
// Path: {baseURL}/orgs
// Method: GET

export const getAllOrganizationsRoute = {
  path: (baseURL: string) => `${baseURL}/orgs`,
  method: "GET",
};

export type GetAllOrganizationsResponseBody = {
  organizations: Organization[];
};

// Update organization
//
// Path: {baseURL}/orgs/{organizationId}
// Method: PUT

export const updateOrganizationRoute = {
  path: (
    baseURL: string,
    { organizationId }: UpdateOrganizationRequestParams
  ) => `${baseURL}/orgs/${organizationId}`,
  method: "PUT",
};

export type UpdateOrganizationRequestParams = {
  organizationId: string;
};

export type UpdateOrganizationRequestBody = {
  orgAttrs: UpdateOrganizationInput;
};

export type UpdateOrganizationResponseBody = {
  organization: Organization;
};
