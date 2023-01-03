import {
  AuthorizationType,
  Cors,
  LambdaIntegration,
  MethodOptions,
  ResourceOptions,
  RestApi,
  IResource,
} from "aws-cdk-lib/aws-apigateway";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

import { Tables } from "lib/tables.stack";

export class Users {
  private scope: Construct;
  private region: string;
  private prefix: string;
  private tables: Tables;
  private api: RestApi;
  private authorizerId: string;
  private optionsWithCors: ResourceOptions;
  private optionsWithAuth: MethodOptions;
  private usersRoute: IResource;
  private userRoute: IResource;
  private meRoute: IResource;
  private userPool: UserPool;

  constructor(
    scope: Construct,
    region: string,
    prefix: string,
    tables: Tables,
    api: RestApi,
    authorizerId: string,
    userPool: UserPool
  ) {
    this.scope = scope;
    this.region = region;
    this.prefix = prefix;
    this.tables = tables;
    this.api = api;
    this.authorizerId = authorizerId;
    this.userPool = userPool;

    this.optionsWithCors = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowCredentials: true,
        allowHeaders: ["*"],
      },
    };

    this.optionsWithAuth = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: this.authorizerId,
      },
    };

    this.usersRoute = this.api.root.addResource("users", this.optionsWithCors);
    this.meRoute = this.api.root.addResource("user", this.optionsWithCors);
    this.userRoute = this.usersRoute.addResource(
      "{userId}",
      this.optionsWithCors
    );

    this.init();
  }

  private init() {
    this.getCurrentUser();
    this.updateUser();
    this.getUsers();
    this.createUser();
    this.deleteUser();
    this.promoteUser();
    this.demoteUser();
  }

  private getCurrentUser() {
    const getCurrentUser = this.createLambda("get-current-user");
    this.tables.AppTable.grantReadWriteData(getCurrentUser);
    const getCurrentUserIntegration = new LambdaIntegration(getCurrentUser);
    this.meRoute.addMethod(
      "GET",
      getCurrentUserIntegration,
      this.optionsWithAuth
    );
  }

  private updateUser() {
    const updateUser = this.createLambda("update-user");
    this.tables.AppTable.grantReadWriteData(updateUser);
    const updateUserIntegration = new LambdaIntegration(updateUser);
    this.meRoute.addMethod("PUT", updateUserIntegration, this.optionsWithAuth);
  }

  private getUsers() {
    const getUsers = this.createLambda("get-users");
    this.tables.AppTable.grantReadWriteData(getUsers);
    const getUsersIntegration = new LambdaIntegration(getUsers);
    this.usersRoute.addMethod("GET", getUsersIntegration, this.optionsWithAuth);
  }

  private createUser() {
    const createUser = this.createLambda("create-user");
    this.tables.AppTable.grantReadWriteData(createUser);
    this.userPool.grant(
      createUser,
      ...["cognito-idp:AdminAddUserToGroup", "cognito-idp:AdminCreateUser"]
    );
    const createUserIntegration = new LambdaIntegration(createUser);
    this.usersRoute.addMethod(
      "POST",
      createUserIntegration,
      this.optionsWithAuth
    );
  }

  private deleteUser() {
    const deleteUser = this.createLambda("delete-user");
    this.tables.AppTable.grantReadWriteData(deleteUser);
    this.userPool.grant(deleteUser, ...["cognito-idp:AdminDeleteUser"]);
    const deleteUserIntegration = new LambdaIntegration(deleteUser);
    this.userRoute.addMethod(
      "DELETE",
      deleteUserIntegration,
      this.optionsWithAuth
    );
  }

  private promoteUser() {
    const promoteUser = this.createLambda("promote-user");
    this.tables.AppTable.grantReadWriteData(promoteUser);
    this.userPool.grant(promoteUser, ...["cognito-idp:AdminAddUserToGroup"]);
    const promoteUserIntegration = new LambdaIntegration(promoteUser);
    this.userRoute
      .addResource("promote", this.optionsWithCors)
      .addMethod("PUT", promoteUserIntegration, this.optionsWithAuth);
  }

  private demoteUser() {
    const demoteUser = this.createLambda("demote-user");
    this.tables.AppTable.grantReadWriteData(demoteUser);
    this.userPool.grant(demoteUser, ...["cognito-idp:AdminRemoveUserToGroup"]);
    const demoteUserIntegration = new LambdaIntegration(demoteUser);
    this.userRoute
      .addResource("demote", this.optionsWithCors)
      .addMethod("PUT", demoteUserIntegration, this.optionsWithAuth);
  }

  private createLambda(name: string) {
    const lambdaId = `${this.prefix}-users-${name}`;
    return new NodejsFunction(this.scope, lambdaId, {
      entry: join(__dirname, "..", "functions", "users", `${name}.function.ts`),
      handler: "handler",
      functionName: lambdaId,
      environment: {
        APP_TABLE_NAME: this.tables.AppTable.tableName,
        REGION: this.region,
        USER_POOL_ID: this.userPool.userPoolId,
      },
      runtime: Runtime.NODEJS_16_X,
    });
  }
}
