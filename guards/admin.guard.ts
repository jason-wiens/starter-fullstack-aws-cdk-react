import { UserGroups } from "client/types";
import { APIGatewayProxyEvent } from "aws-lambda";
import { PermissionError } from "errors";
import { AuthService, UserService } from "services";
import { User } from "models";

type InputReturnUserUndefined = {
  event: APIGatewayProxyEvent;
  returnUser?: undefined;
};
type InputReturnUserFalse = {
  event: APIGatewayProxyEvent;
  returnUser: false;
};
type InputReturnUserTrue = {
  event: APIGatewayProxyEvent;
  returnUser: true;
};

type AdminGuardInput =
  | InputReturnUserUndefined
  | InputReturnUserFalse
  | InputReturnUserTrue;

type AdminGuardOutput<T> = T extends InputReturnUserTrue
  ? User
  : T extends InputReturnUserFalse
  ? void
  : T extends InputReturnUserUndefined
  ? void
  : never;

export const adminGuard = async <T extends AdminGuardInput>(
  input: T
): Promise<AdminGuardOutput<T>> => {
  const { event, returnUser } = input;

  // check if authenticated
  const authService = new AuthService();
  const currentUser = authService.getCurrentAuthenticatedUser(event);
  if (!currentUser) {
    throw new PermissionError("Unauthorized");
  }
  const { email, groups } = currentUser;

  // check if admin
  if (!groups?.includes(UserGroups.Admin)) {
    throw new PermissionError("Admin permission required");
  }

  // returnif no user is requested
  if (!returnUser) {
    return undefined as AdminGuardOutput<T>;
  }

  const userService = new UserService();
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new Error("User not found"); // should never happen
  }

  return user as AdminGuardOutput<T>;
};
