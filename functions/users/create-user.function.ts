import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { AuthService, UserService } from "services";

import { getEventBody, addCorsHeader, errorHandler } from "utils";
import { adminGuard } from "guards";
import { validateCreateUserInput } from "validators/users";
import type {
  CreateUserRequestBody,
  CreateUserResponseBody,
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
    const { organizationId } = await adminGuard({ event, returnUser: true });
    const newUserInput = {
      ...(await validateCreateUserInput(
        getEventBody<CreateUserRequestBody>(event)
      )),
      organizationId,
    };
    const user = await userService.createUser(newUserInput);
    await authService.setupUserAuth(user.email);

    const responseBody: CreateUserResponseBody = {
      user,
    };

    response.body = JSON.stringify(responseBody);
  } catch (err) {
    return errorHandler(err);
  }

  return response;
};
