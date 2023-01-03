import * as DynamoDB from "aws-sdk/clients/dynamodb";
import { Table } from "dynamodb-toolbox";

const DocumentClient = new DynamoDB.DocumentClient({
  region: process.env.REGION,
});

export const AppTable = new Table({
  name: process.env.APP_TABLE_NAME!,
  partitionKey: "PK",
  sortKey: "SK",
  DocumentClient,
  indexes: {
    GSI1: { partitionKey: "GSI1PK", sortKey: "GSI1SK" },
    GSI2: { partitionKey: "GSI2PK", sortKey: "GSI2SK" },
  },
});
