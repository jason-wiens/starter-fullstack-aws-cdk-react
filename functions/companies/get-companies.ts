import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { isAdmin } from "guards/admin.guard";

import { getCurrentUser } from "utils/get-current-user";
import { addCorsHeader } from "utils/add-cors-header";
import { unmarshall } from "@aws-sdk/util-dynamodb";

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

  const getCompaniesCommand = new QueryCommand({
    TableName: process.env.TABLE_NAME || "",
    IndexName: "GSI1",
    KeyConditionExpression: "GSI1PK = :pk AND begins_with(GSI1SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": { S: `ORG#${organizationId}` },
      ":sk": { S: "COM#" },
    },
  });

  try {
    const { Count, Items, LastEvaluatedKey } = await db.send(
      getCompaniesCommand
    );

    response.body = JSON.stringify({
      count: Count,
      companies:
        !!Items && Items.length > 0
          ? Items.map((item) => unmarshall(item))
          : [],
      lastEvaluatedKey: LastEvaluatedKey,
    });
  } catch (error) {
    console.log(error);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Internal Server Error: Unable to get companies.",
    });
    return response;
  }

  return response;
};
