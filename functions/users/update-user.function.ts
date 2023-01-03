import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { UserService } from "services";

import { getEventBody, addCorsHeader, errorHandler } from "utils";
import { authGuard } from "guards";
import { validateUpdateUserInput } from "validators/users";
import type {
  UpdateUserRequestBody,
  UpdateUserResponseBody,
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

  try {
    const { userId } = await authGuard({ event, returnUser: true });
    const userAttrs = validateUpdateUserInput(
      getEventBody<UpdateUserRequestBody>(event)
    );

    const user = await userService.updateUser(userId, userAttrs);

    const responseBody: UpdateUserResponseBody = {
      user,
    };

    response.body = JSON.stringify(responseBody);
  } catch (err) {
    return errorHandler(err);
  }

  return response;
};
