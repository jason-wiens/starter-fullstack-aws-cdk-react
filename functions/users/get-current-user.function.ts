import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { addCorsHeader, errorHandler } from "utils";
import { authGuard } from "guards";
import type { GetCurrentUserResponseBody } from "client/routes/api/user.routes";

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: "",
  };
  addCorsHeader(response);

  try {
    const user = await authGuard({ event, returnUser: true });
    const responseBody: GetCurrentUserResponseBody = {
      user,
    };
    response.body = JSON.stringify(responseBody);
  } catch (err) {
    return errorHandler(err);
  }

  return response;
};
