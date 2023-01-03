import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class Tables {
  private scope: Construct;
  private prefix: string;
  public AppTable: Table;
  public FailureTable: Table;

  constructor(scope: Construct, prefix: string) {
    this.scope = scope;
    this.prefix = prefix;
    this.init();
  }

  private init() {
    this.createAppTable();
  }

  private createAppTable() {
    this.AppTable = new Table(this.scope, `${this.prefix}-app-table`, {
      partitionKey: { name: "PK", type: AttributeType.STRING },
      sortKey: { name: "SK", type: AttributeType.STRING },
      tableName: `${this.prefix}-app-table`,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    this.AppTable.addGlobalSecondaryIndex({
      indexName: "GSI1",
      partitionKey: { name: "GSI1PK", type: AttributeType.STRING },
      sortKey: { name: "GSI1SK", type: AttributeType.STRING },
    });

    this.AppTable.addGlobalSecondaryIndex({
      indexName: "GSI2",
      partitionKey: { name: "GSI2PK", type: AttributeType.STRING },
      sortKey: { name: "GSI2SK", type: AttributeType.STRING },
    });
  }
}
