import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { MyHttpHandler } from "client/client/http-handler";

type ProgressHandler = (progressPercent: number) => void;

export const getS3Cleint = (
  idToken: string,
  progressHandler: ProgressHandler | undefined = undefined
) => {
  const COGNITO_ID = `cognito-idp.${process.env.REACT_APP_REGION}.amazonaws.com/${process.env.REACT_APP_USER_POOL_ID}`;

  const myHttpHandler = new MyHttpHandler();
  if (progressHandler) {
    myHttpHandler.onProgress$.subscribe((progress) => {
      const percentComplete =
        (progress.progressEvent.loaded / progress.progressEvent.total) * 100;
      progressHandler(percentComplete);
    });
  }

  const credentials = fromCognitoIdentityPool({
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID!,
    clientConfig: { region: process.env.REACT_APP_REGION },
    logins: {
      [COGNITO_ID]: idToken,
    },
  });

  return new S3Client({
    region: process.env.REACT_APP_REGION,
    credentials,
    requestHandler: myHttpHandler,
  });
};
