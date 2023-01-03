import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

import { setAuthHeader } from "client/utils/axios.utils";

type LoginResponse = {
  success: boolean;
  userSession?: CognitoUserSession;
  error?: any;
  newPasswordRequired?: boolean;
  email?: string;
};

export const login = (
  email: string,
  password: string
): Promise<LoginResponse> => {
  return new Promise((resolve) => {
    const userPool = new CognitoUserPool({
      UserPoolId: process.env.REACT_APP_USER_POOL_ID!,
      ClientId: process.env.REACT_APP_CLIENT_ID!,
    });

    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        const idToken = data.getIdToken().getJwtToken();
        setAuthHeader(idToken);
        resolve({
          success: true,
          userSession: data,
        });
      },
      onFailure: (err) => {
        console.log("onFailure: ", err);
        resolve({ success: false, error: err });
      },
      newPasswordRequired: ({ email }) => {
        resolve({
          success: false,
          newPasswordRequired: true,
          email,
        });
      },
    });
  });
};
