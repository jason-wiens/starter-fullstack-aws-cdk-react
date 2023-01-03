import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { AuthService, UserService, OrganizationService } from "services";

import { getEventBody, addCorsHeader, errorHandler } from "utils";
import { superUserGuard } from "guards";
import { validateCreateUserInput } from "validators/users";
import { validateCreateOrganizationInput } from "validators/organizations";
import type {
  CreateOrganizationRequestBody,
  CreateOrganizationResponseBody,
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

  const userService = new UserService();
  const authService = new AuthService();
  const organizationService = new OrganizationService();

  try {
    await superUserGuard({ event });

    const { organization: orgAttrs, adminUser: userAttrs } =
      getEventBody<CreateOrganizationRequestBody>(event);

    const newOrganizationInput = await validateCreateOrganizationInput(
      orgAttrs
    );

    const organization = await organizationService.createOrganization(
      newOrganizationInput
    );
    const { organizationId } = organization;

    const newUserInput = {
      ...(await validateCreateUserInput(userAttrs)),
      organizationId,
    };
    const adminUser = await userService.createUser(newUserInput);
    await authService.setupUserAuth(adminUser.email);
    await authService.promoteToAdmin(adminUser.userId);

    const responseBody: CreateOrganizationResponseBody = {
      organization,
      adminUser,
    };

    response.body = JSON.stringify(responseBody);
  } catch (err) {
    return errorHandler(err);
  }

  return response;
};
