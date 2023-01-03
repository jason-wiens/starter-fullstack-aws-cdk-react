import { App, Stack, StackProps } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";

import { Tables } from "./tables.stack";
import { Auth } from "./auth.stack";
import { Users } from "./user.stack";
import { Organizations } from "./organization.stack";
// import { CompanyStack } from "./company.stack";

export class MainStack extends Stack {
  private prefix: string;
  private auth: Auth;
  private users: Users;
  private orgs: Organizations;
  // private companies: CompanyStack;
  private tables: Tables;
  private api: RestApi;

  constructor(app: App, id: string, props: StackProps, prefix: string) {
    super(app, id, props);
    this.prefix = prefix;

    this.tables = new Tables(this, this.prefix);
    this.api = new RestApi(this, `${this.prefix}-api`, {
      restApiName: `${this.prefix}-api`,
    });

    this.auth = new Auth(this, this.api);
    this.users = new Users(
      this,
      this.region,
      this.prefix,
      this.tables,
      this.api,
      this.auth.authorizer.authorizerId,
      this.auth.userPool
    );

    this.orgs = new Organizations(
      this,
      this.region,
      this.prefix,
      this.tables,
      this.api,
      this.auth.authorizer.authorizerId,
      this.auth.userPool
    );
    // this.companies = new CompanyStack(
    //   this,
    //   this.tables.AppTable,
    //   this.api,
    //   this.auth.authorizer.authorizerId
    // );
  }
}
