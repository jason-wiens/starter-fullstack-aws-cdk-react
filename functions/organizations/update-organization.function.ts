import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { OrganizationService } from "services";

import {
  getEventPathParams,
  getEventBody,
  addCorsHeader,
  errorHandler,
} from "utils";
import { superUserGuard } from "guards";
import { validateUpdateOrganizationInput } from "validators/organizations";
import type {
  UpdateOrganizationRequestParams,
  UpdateOrganizationResponseBody,
  UpdateOrganizationRequestBody,
} from "client/routes/api/organization.routes";

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

    const { organizationId } =
      getEventPathParams<UpdateOrganizationRequestParams>(event);

    const { orgAttrs } = getEventBody<UpdateOrganizationRequestBody>(event);

    const updateOrganizationInput = await validateUpdateOrganizationInput(
      orgAttrs
    );

    const organization = await organizationService.updateOrganization(
      organizationId,
      updateOrganizationInput
    );

    const responseBody: UpdateOrganizationResponseBody = {
      organization,
    };

    response.body = JSON.stringify(responseBody);
  } catch (err) {
    return errorHandler(err);
  }

  return response;
};
