import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

type NewPasswordResponse = {
  success: boolean;
  error?: any;
  userSession?: CognitoUserSession;
};

export const newPassword = (
  email: string,
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
): Promise<NewPasswordResponse> => {
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
      Password: oldPassword,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
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
        user.completeNewPasswordChallenge(newPassword, [], {
          onSuccess: (data) => {
            resolve({
              success: true,
              userSession: data,
            });
          },
          onFailure: (err) => {
            console.log("onFailure: ", err);
            resolve({ success: false, error: err });
          },
        });
      },
    });
  });
};
