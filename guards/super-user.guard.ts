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

type SuperUserGuardInput =
  | InputReturnUserUndefined
  | InputReturnUserFalse
  | InputReturnUserTrue;

type SuperUserGuardOutput<T> = T extends InputReturnUserTrue
  ? User
  : T extends InputReturnUserFalse
  ? void
  : T extends InputReturnUserUndefined
  ? void
  : never;

export const superUserGuard = async <T extends SuperUserGuardInput>(
  input: T
): Promise<SuperUserGuardOutput<T>> => {
  const { event, returnUser } = input;

  // check if authenticated
  const authService = new AuthService();
  const currentUser = authService.getCurrentAuthenticatedUser(event);
  if (!currentUser) {
    throw new PermissionError("Unauthorized");
  }
  const { email, groups } = currentUser;

  // check if super user
  if (!groups?.includes(UserGroups.SuperUser)) {
    throw new PermissionError("SuperUser permission required");
  }

  // returnif no user is requested
  if (!returnUser) {
    return undefined as SuperUserGuardOutput<T>;
  }

  const userService = new UserService();
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new Error("User not found"); // should never happen
  }

  return user as SuperUserGuardOutput<T>;
};
