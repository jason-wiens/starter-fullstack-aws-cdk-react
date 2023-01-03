import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { APIGatewayProxyEvent } from "aws-lambda";

interface IAuthService {
  setupUserAuth: (email: string) => Promise<void>;
  removeUserAuth: (email: string) => Promise<void>;
  getCurrentAuthenticatedUser: (
    event: APIGatewayProxyEvent
  ) => CurrentAuthenticatedUser | undefined;
  promoteToAdmin: (email: string) => Promise<void>;
  demoteFromAdmin: (email: string) => Promise<void>;
}

export class AuthService implements IAuthService {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.REGION || "ca-central-1",
    });
  }

  public async setupUserAuth(email: string) {
    await this.cognitoClient.send(
      new AdminCreateUserCommand({
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
        DesiredDeliveryMediums: ["EMAIL"],
        UserAttributes: [
          {
            Name: "email",
            Value: email,
          },
          {
            Name: "email_verified",
            Value: "True",
          },
        ],
      })
    );
  }

  public async removeUserAuth(email: string) {
    await this.cognitoClient.send(
      new AdminDeleteUserCommand({
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
      })
    );
  }

  public async promoteToAdmin(email: string) {
    await this.cognitoClient.send(
      new AdminAddUserToGroupCommand({
        GroupName: "admins",
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
      })
    );
  }

  public async demoteFromAdmin(email: string) {
    await this.cognitoClient.send(
      new AdminRemoveUserFromGroupCommand({
        GroupName: "admins",
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
      })
    );
  }

  public getCurrentAuthenticatedUser(
    event: APIGatewayProxyEvent
  ): CurrentAuthenticatedUser | undefined {
    const user = {} as CurrentAuthenticatedUser;

    const authUserAttributes = event.requestContext.authorizer?.claims;
    const groups = event.requestContext.authorizer?.claims["cognito:groups"];

    if (authUserAttributes.email) {
      user.email = authUserAttributes.email;
    } else {
      return undefined;
    }
    if (authUserAttributes.sub) {
      user.userId = authUserAttributes.sub;
    } else {
      return undefined;
    }
    if (groups) {
      user.groups = (groups as string).split(",");
    }

    return user;
  }
}
