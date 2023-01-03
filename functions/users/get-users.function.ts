import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { AuthService, UserService } from "services";

import { addCorsHeader, errorHandler } from "utils";
import { adminGuard } from "guards";
import type { GetOrganizationUsersResponseBody } from "client/routes/api/user.routes";

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

  try {
    const { organizationId } = await adminGuard({ event, returnUser: true });

    const users = await userService.getUsersByOrganizationId(organizationId);

    const responseBody: GetOrganizationUsersResponseBody = {
      users,
    };

    response.body = JSON.stringify(responseBody);
  } catch (err) {
    return errorHandler(err);
  }

  return response;
};
