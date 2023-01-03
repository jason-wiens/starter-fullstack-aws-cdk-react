import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { OrganizationService } from "services";

import { addCorsHeader, errorHandler } from "utils";
import { superUserGuard } from "guards";
import type { GetAllOrganizationsResponseBody } from "client/routes/api/organization.routes";

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
    await superUserGuard({ event });

    const organizations = await organizationService.getAllOrganizations();

    const responseBody: GetAllOrganizationsResponseBody = {
      organizations,
    };

    response.body = JSON.stringify(responseBody);
  } catch (err) {
    return errorHandler(err);
  }

  return response;
};
