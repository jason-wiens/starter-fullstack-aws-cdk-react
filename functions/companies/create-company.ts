import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 as uuid } from "uuid";

import { CreateCompanyInput } from "models/compnay.model";

import { isAdmin } from "guards/admin.guard";
import { validateCreateCompanyInput } from "validators/company.validator";

import { getCurrentUser } from "utils/get-current-user";
import { addCorsHeader } from "utils/add-cors-header";
import { getEventBody } from "utils/get-event-body";

const db = new DynamoDBClient({
  region: process.env.REGION || "ca-central-1",
});

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const response: APIGatewayProxyResult = {
    statusCode: 201,
    body: "",
  };
  addCorsHeader(response);

  const user = getCurrentUser(event);
  const hasPermission = isAdmin(event);

  if (!user || !hasPermission) {
    response.statusCode = 401;
    response.body = JSON.stringify({ message: "Unauthorized" });
    return response;
  }

  const { organizationId } = user;
  const companyId = uuid();

  const body = getEventBody(event) as CreateCompanyInput;
  const errors = validateCreateCompanyInput(body);

  if (errors.length > 0) {
    response.statusCode = 400;
    response.body = JSON.stringify(errors);
    return response;
  }

  // check if company exists
  const getCompanyCommand = new QueryCommand({
    TableName: process.env.TABLE_NAME || "",
    IndexName: "GSI1",
    KeyConditionExpression: "GSI1PK = :pk AND GSI1SK = :sk",
    ExpressionAttributeValues: {
      ":pk": { S: `ORG#${organizationId}` },
      ":sk": { S: `COM#${body.shortName}` },
    },
  });

  const company = {
    PK: { S: `COM#${body.shortName}` },
    SK: { S: `ORG#${organizationId}` },
    GSI1PK: { S: `ORG#${organizationId}` },
    GSI1SK: { S: `COM#${body.shortName}` },
    id: { S: companyId },
    createdAt: { S: new Date().toISOString() },
    updatedAt: { S: new Date().toISOString() },
    fullName: { S: body.fullName },
    shortName: { S: body.shortName },
    address: { S: body.address },
    city: { S: body.city },
    province: { S: body.province },
    country: { S: body.country },
    postalCode: { S: body.postalCode },
    logoUrl: { S: body.logoUrl || "" },
  };
  const createCompanyCommand = new PutItemCommand({
    Item: company,
    TableName: process.env.TABLE_NAME || "",
  });

  try {
    const existingCompany = await db.send(getCompanyCommand);
    if (existingCompany.Count && existingCompany.Count > 0) {
      response.statusCode = 400;
      response.body = JSON.stringify({ message: "Company already exists." });
      return response;
    }

    const dbResponse = await db.send(createCompanyCommand);
    console.log(JSON.stringify(dbResponse, null, 2));
    response.body = JSON.stringify({ message: "Company created" });
  } catch (error) {
    console.log(error);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Internal Server Error: Unable to create company.",
    });
    return response;
  }

  return response;
};
