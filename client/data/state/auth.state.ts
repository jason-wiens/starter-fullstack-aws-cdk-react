import { CognitoUserSession } from "amazon-cognito-identity-js";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { UserGroups } from "client/types";

interface AuthState {
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperUser: boolean;
  email?: string;
}

interface AuthActions {
  setAuthState: (userSession: CognitoUserSession) => void;
  setEmail: (email: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        idToken: undefined,
        accessToken: undefined,
        refreshToken: undefined,
        isAuthenticated: false,
        isAdmin: false,
        isSuperUser: false,
        email: "",
        setEmail: (email: string) => set({ email }),
        setAuthState: (userSession: CognitoUserSession) => {
          const idToken = userSession.getIdToken().getJwtToken();
          const accessToken = userSession.getAccessToken().getJwtToken();
          const refreshToken = userSession.getRefreshToken().getToken();
          const email = userSession.getIdToken().payload["email"];
          const isAdmin = userSession
            .getIdToken()
            .payload["cognito:groups"]?.includes(UserGroups.Admin);
          const isSuperUser = userSession
            .getIdToken()
            .payload["cognito:groups"]?.includes(UserGroups.SuperUser);
          const isAuthenticated = true;
          set({
            idToken,
            accessToken,
            refreshToken,
            email,
            isAdmin,
            isSuperUser,
            isAuthenticated,
          });
        },
        logout: () => {
          set({
            idToken: undefined,
            accessToken: undefined,
            refreshToken: undefined,
            isAuthenticated: false,
            isAdmin: false,
            isSuperUser: false,
            email: "",
          });
        },
      }),
      {
        name: "aiq-auth",
      }
    )
  )
);
