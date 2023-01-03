import { APIGatewayProxyResult } from "aws-lambda";

export function addCorsHeader(result: APIGatewayProxyResult) {
  result.headers = {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  };
}
