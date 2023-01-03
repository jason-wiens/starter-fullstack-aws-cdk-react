import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { MainStack } from "../lib/main.stack";

const STACK_NAME = "starter-stack";
const STACK_PREFIX = "starter";

const app = new cdk.App();

new MainStack(
  app,
  `${STACK_PREFIX}-stack`,
  {
    stackName: STACK_NAME,
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  },
  STACK_PREFIX
);
