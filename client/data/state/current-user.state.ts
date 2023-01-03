import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User, Organization } from "models";
import {
  getCurrentUserAction,
  getOrganizationAction,
} from "data/actions/current-user";

interface CurrentUserState {
  user: User | undefined;
  organization: Organization | undefined;
}

interface CurrentUserActions {
  getCurrentUser: () => Promise<void>;
  getOrganization: (id: string) => Promise<void>;
}

export const useCurrentUser = create<CurrentUserState & CurrentUserActions>()(
  devtools(
    persist(
      (set) => ({
        user: undefined,
        organization: undefined,
        getCurrentUser: async () => set({ user: await getCurrentUserAction() }),
        getOrganization: async (id) =>
          set({ organization: await getOrganizationAction(id) }),
      }),
      {
        name: "users",
      }
    )
  )
);
