import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { AuthService, UserService } from "services";

import { getEventPathParams, addCorsHeader, errorHandler } from "utils";
import { adminGuard } from "guards";
import type {
  DeleteUserResponseBody,
  DeleteUserRequestPathParams,
} from "client/routes/api/user.routes";

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: "",
  };
  addCorsHeader(response);

  const userService = new UserService();
  const authService = new AuthService();

  try {
    await adminGuard({ event });
    const { userId } = getEventPathParams<DeleteUserRequestPathParams>(event);
    const deletedUser = await userService.deleteUser(userId);
    await authService.removeUserAuth(deletedUser.email);

    const responseBody: DeleteUserResponseBody = {
      deletedUser,
    };

    response.body = JSON.stringify(responseBody);
  } catch (err) {
    return errorHandler(err);
  }

  return response;
};
