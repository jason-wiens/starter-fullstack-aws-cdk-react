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

export class Organizations {
  private scope: Construct;
  private region: string;
  private prefix: string;
  private tables: Tables;
  private api: RestApi;
  private authorizerId: string;
  private optionsWithCors: ResourceOptions;
  private optionsWithAuth: MethodOptions;
  private orgsRoute: IResource;
  private orgRoute: IResource;
  private myOrgRoute: IResource;
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

    this.orgsRoute = this.api.root.addResource("orgs", this.optionsWithCors);
    this.myOrgRoute = this.api.root.addResource("org", this.optionsWithCors);
    this.orgRoute = this.orgsRoute.addResource(
      "{organizationId}",
      this.optionsWithCors
    );

    this.init();
  }

  private init() {
    this.createOrganization();
    this.getMyOrganization();
    this.getOrganizations();
    this.updateOrganization();
  }

  private createOrganization() {
    const createOrganization = this.createLambda("create-organization");
    this.tables.AppTable.grantReadWriteData(createOrganization);
    this.userPool.grant(
      createOrganization,
      ...["cognito-idp:AdminAddUserToGroup", "cognito-idp:AdminCreateUser"]
    );

    const createOrganizationIntegration = new LambdaIntegration(
      createOrganization
    );
    this.orgsRoute.addMethod(
      "POST",
      createOrganizationIntegration,
      this.optionsWithAuth
    );
  }

  private getMyOrganization() {
    const getCurrentUserOrganization = this.createLambda("get-my-organization");
    this.tables.AppTable.grantReadWriteData(getCurrentUserOrganization);
    const getCurrentUserOrganizationIntegration = new LambdaIntegration(
      getCurrentUserOrganization
    );
    this.myOrgRoute.addMethod(
      "GET",
      getCurrentUserOrganizationIntegration,
      this.optionsWithAuth
    );
  }

  private getOrganizations() {
    const getOrganizations = this.createLambda("get-organizations");
    this.tables.AppTable.grantReadWriteData(getOrganizations);
    const getOrganizationsIntegration = new LambdaIntegration(getOrganizations);
    this.orgsRoute.addMethod(
      "GET",
      getOrganizationsIntegration,
      this.optionsWithAuth
    );
  }

  private updateOrganization() {
    const updateOrganization = this.createLambda("update-organization");
    this.tables.AppTable.grantReadWriteData(updateOrganization);
    const updateOrganizationIntegration = new LambdaIntegration(
      updateOrganization
    );
    this.orgRoute.addMethod(
      "PUT",
      updateOrganizationIntegration,
      this.optionsWithAuth
    );
  }

  private createLambda(name: string) {
    const lambdaId = `${this.prefix}-orgs-${name}`;
    return new NodejsFunction(this.scope, lambdaId, {
      entry: join(
        __dirname,
        "..",
        "functions",
        "organizations",
        `${name}.function.ts`
      ),
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
