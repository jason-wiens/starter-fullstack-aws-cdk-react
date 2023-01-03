import { CfnOutput, Duration } from "aws-cdk-lib";
import {
  CognitoUserPoolsAuthorizer,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import {
  CfnUserPoolGroup,
  StringAttribute,
  UserPool,
  UserPoolClient,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
} from "aws-cdk-lib/aws-cognito";
import { FederatedPrincipal, Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class Auth {
  private scope: Construct;
  private userPoolClient: UserPoolClient;
  private api: RestApi;
  private identityPool: CfnIdentityPool;
  private authenticatedRole: Role;

  public userPool: UserPool;
  public authorizer: CognitoUserPoolsAuthorizer;

  constructor(scope: Construct, api: RestApi) {
    this.scope = scope;
    this.api = api;
    this.init();
  }

  private init() {
    this.createUserPool();
    this.createUserPoolClient();
    this.createAuthorizer();
    this.createAdminsGroup();
    this.createSuperUserGroup();
    this.createIdentityPool();
    this.initializeRoles();
    this.attachRoles();
  }

  private createUserPool() {
    this.userPool = new UserPool(this.scope, "template-user-pool", {
      userPoolName: "TemplateUserPool",
      selfSignUpEnabled: false,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
    });

    new CfnOutput(this.scope, "UserPoolId", {
      value: this.userPool.userPoolId,
    });
  }

  private createAuthorizer() {
    this.authorizer = new CognitoUserPoolsAuthorizer(
      this.scope,
      "template-authorizer",
      {
        cognitoUserPools: [this.userPool],
        authorizerName: "template-authorizer",
        identitySource: "method.request.header.Authorization",
      }
    );
    this.authorizer._attachToApi(this.api);
  }

  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient("template-user-pool-client", {
      userPoolClientName: "TemplateUserPoolClient",
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
      generateSecret: false,
      idTokenValidity: Duration.days(1),
      refreshTokenValidity: Duration.days(30),
      accessTokenValidity: Duration.days(1),
    });
    new CfnOutput(this.scope, "UserPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
    });
  }

  private createAdminsGroup() {
    new CfnUserPoolGroup(this.scope, "admins", {
      groupName: "admins",
      userPoolId: this.userPool.userPoolId,
      // roleArn: this.identityPoolWrapper.adminRole.roleArn
    });
  }

  private createSuperUserGroup() {
    new CfnUserPoolGroup(this.scope, "super-user", {
      groupName: "super-user",
      userPoolId: this.userPool.userPoolId,
      // roleArn: this.identityPoolWrapper.adminRole.roleArn
    });
  }

  private createIdentityPool() {
    this.identityPool = new CfnIdentityPool(
      this.scope,
      "TemplateIdentityPool",
      {
        allowUnauthenticatedIdentities: false,
        cognitoIdentityProviders: [
          {
            clientId: this.userPoolClient.userPoolClientId,
            providerName: this.userPool.userPoolProviderName,
          },
        ],
      }
    );
    new CfnOutput(this.scope, "IdentityPoolId", {
      value: this.identityPool.ref,
    });
  }

  private initializeRoles() {
    this.authenticatedRole = new Role(
      this.scope,
      "CognitoDefaultAuthenticatedRole",
      {
        assumedBy: new FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "authenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity"
        ),
      }
    );
  }

  private attachRoles() {
    new CfnIdentityPoolRoleAttachment(this.scope, "RolesAttachment", {
      identityPoolId: this.identityPool.ref,
      roles: {
        authenticated: this.authenticatedRole.roleArn,
      },
    });
  }
}
