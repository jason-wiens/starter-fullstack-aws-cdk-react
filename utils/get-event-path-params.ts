import { APIGatewayProxyEvent } from "aws-lambda";

export function getEventPathParams<T = any>(event: APIGatewayProxyEvent) {
  if (event.pathParameters === null) {
    return {} as T;
  }
  return typeof event.pathParameters == "object"
    ? (event.pathParameters as unknown as T)
    : (JSON.parse(event.pathParameters) as T);
}
