import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { NotFoundError } from "errors";

import { AuthService, UserService } from "services";

import { getEventPathParams, addCorsHeader, errorHandler } from "utils";
import { adminGuard } from "guards";
import type {
  DemoteUserRequestParams,
  DemoteUserResponseBody,
} from "client/routes/api/user.routes";

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const response: APIGatewayProxyResult = {
    statusCode: 201,
    body: "",
  };
  addCorsHeader(response);

  const userService = new UserService();
  const authService = new AuthService();

  try {
    await adminGuard({ event });

    const { userId } = getEventPathParams<DemoteUserRequestParams>(event);

    const user = await userService.getUserById(userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    await authService.demoteFromAdmin(user.email);

    const updateUser = await userService.updateUser(userId, {
      isAdmin: false,
    });

    const responseBody: DemoteUserResponseBody = {
      user: updateUser,
    };

    response.body = JSON.stringify(responseBody);
  } catch (err) {
    return errorHandler(err);
  }

  return response;
};
