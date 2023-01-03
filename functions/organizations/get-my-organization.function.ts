import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { OrganizationService } from "services";

import { addCorsHeader, errorHandler } from "utils";
import { authGuard } from "guards";
import type { GetMyOrganizationResponseBody } from "client/routes/api/organization.routes";
import { NotFoundError } from "errors";

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const response: APIGatewayProxyResult = {
    statusCode: 201,
    body: "",
  };
  addCorsHeader(response);

  const organizationService = new OrganizationService();

  try {
    const { organizationId } = await authGuard({ event, returnUser: true });

    const organization = await organizationService.getOrganizationById(
      organizationId
    );

    if (!organization) throw new NotFoundError("Organization not found");

    const responseBody: GetMyOrganizationResponseBody = {
      organization,
    };

    response.body = JSON.stringify(responseBody);
  } catch (err) {
    return errorHandler(err);
  }

  return response;
};
