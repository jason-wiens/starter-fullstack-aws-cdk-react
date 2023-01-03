import { APIGatewayProxyResult } from "aws-lambda";
import { CustomError } from "../errors";
import { addCorsHeader } from "./add-cors-header";

export const errorHandler = (err: any) => {
  const response: APIGatewayProxyResult = {
    statusCode: 500,
    body: "",
  };
  addCorsHeader(response);

  console.error(err);

  if (err instanceof CustomError) {
    response.statusCode = err.statusCode;
    response.body = JSON.stringify({ errors: err.serializeErrors() });
    return response;
  }

  response.body = JSON.stringify({
    errors: [{ message: err.message || "Opps... Something went wrong." }],
  });
  return response;
};
