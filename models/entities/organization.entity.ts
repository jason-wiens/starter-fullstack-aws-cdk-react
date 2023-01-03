import { Entity } from "dynamodb-toolbox";
import { AppTable } from "models/tables";

export const OrganizationEntity = new Entity<
  "organization",
  Organization,
  OrganizationCompositeKey,
  typeof AppTable
>({
  name: "organization",
  attributes: {
    PK: {
      partitionKey: true,
      hidden: true,
      default: (data: { organizationId: string }) =>
        `ORG#${data.organizationId}`,
    },
    SK: {
      sortKey: true,
      hidden: true,
      default: (data: { organizationId: string }) =>
        `ORG#${data.organizationId}`,
    },
    GSI1PK: {
      hidden: true,
      default: "TYPE#ORGANIZATION",
    },
    GSI1SK: {
      hidden: true,
      default: (data: { organizationId: string }) =>
        `ORG#${data.organizationId}`,
    },
    organizationId: "string",
    legalName: "string",
    displayName: "string",
    logoUrl: "string",
    address: "string",
    city: "string",
    province: "string",
    postalCode: "string",
  },
  table: AppTable,
  autoExecute: true,
} as const);
