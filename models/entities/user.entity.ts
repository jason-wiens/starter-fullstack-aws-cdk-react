import { Entity } from "dynamodb-toolbox";
import { AppTable } from "models/tables";

export const UserEntity = new Entity<
  "user",
  User,
  UserCompositeKey,
  typeof AppTable
>({
  name: "user",
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
      default: (data: { userId: string }) => `USER#${data.userId}`,
    },
    GSI1PK: {
      hidden: true,
      default: (data: { userId: string }) => `USER#${data.userId}`,
    },
    GSI1SK: {
      hidden: true,
      default: (data: { userId: string }) => `USER#${data.userId}`,
    },
    GSI2PK: {
      hidden: true,
      default: (data: { email: string }) => `EMAIL#${data.email}`,
    },
    GSI2SK: {
      hidden: true,
      default: (data: { email: string }) => `EMAIL#${data.email}`,
    },
    userId: "string",
    email: "string",
    firstName: "string",
    lastName: "string",
    phoneNumber: "string",
    avatarUrl: "string",
    isAdmin: "boolean",
  },
  table: AppTable,
  autoExecute: true,
} as const);
