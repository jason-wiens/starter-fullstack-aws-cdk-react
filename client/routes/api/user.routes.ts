// Create New User
//
// Path: {baseURL}/users
// Method: POST

export const createUserRoute = {
  path: (baseURL: string) => `${baseURL}/users`,
  method: "POST",
};

export type CreateUserRequestBody = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatarUrl?: string;
};

export type CreateUserResponseBody = {
  user: User;
};

// Delete User
//
// Path: {baseURL}/users/{userId}
// Method: DELETE

export const deleteUserRoute = {
  path: (baseURL: string, { userId }: DeleteUserRequestPathParams) =>
    `${baseURL}/users/${userId}`,
  method: "DELETE",
};

export type DeleteUserRequestPathParams = {
  userId: string;
};

export type DeleteUserResponseBody = {
  deletedUser: User;
};

// Get Current User
//
// Path: {baseURL}/user
// Method: GET

export const getCurrentUserRoute = {
  path: (baseURL: string) => `${baseURL}/user`,
  method: "GET",
};

export type GetCurrentUserResponseBody = {
  user: User;
};

// Get all users in organization
//
// Path: {baseURL}/users
// Method: GET

export const getOrganizationUsersRoute = {
  path: (baseURL: string) => `${baseURL}/users`,
  method: "GET",
};

export type GetOrganizationUsersResponseBody = {
  users: User[];
};

// Update User
//
// Path: {baseURL}/user
// Method: PUT

export const UpdateUserRoute = {
  path: (baseURL: string) => `${baseURL}/user`,
  method: "PUT",
};

export type UpdateUserRequestBody = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
};

export type UpdateUserResponseBody = {
  user: User;
};

// Promote user to admin
//
// Path: {baseURL}/users/{userId}/promote
// Method: PUT

export const PromoteUserRoute = {
  path: (baseURL: string, { userId }: PromoteUserRequestParams) =>
    `${baseURL}/users/${userId}`,
  method: "PUT",
};

export type PromoteUserRequestParams = {
  userId: string;
};

export type PromoteUserResponseBody = {
  user: User;
};

// Demote user from admin
//
// Path: {baseURL}/users/{userId}/demote
// Method: PUT

export const DemoteUserRoute = {
  path: (baseURL: string, { userId }: DemoteUserRequestParams) =>
    `${baseURL}/users/${userId}`,
  method: "PUT",
};

export type DemoteUserRequestParams = {
  userId: string;
};

export type DemoteUserResponseBody = {
  user: User;
};
