import { APIGatewayProxyEvent } from "aws-lambda";

export function getEventBody<T = any>(event: APIGatewayProxyEvent) {
  if (event.body === null) {
    return {} as T;
  }
  return typeof event.body == "object"
    ? (event.body as T)
    : (JSON.parse(event.body) as T);
}
