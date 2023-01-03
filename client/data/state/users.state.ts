import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { produce } from "immer";

import { User } from "models";
import {
  getUsersAction,
  createUserAction,
  CreateUserFormFields,
} from "data/actions/users";

interface UserState {
  isLoading: boolean;
  users: User[];
}

interface UserActions {
  getUsers: () => Promise<void>;
  createUser: (
    formData: CreateUserFormFields
  ) => Promise<{ errors?: FormErrors<CreateUserFormFields> }>;
}

export const useUsers = create<UserState & UserActions>()(
  devtools(
    persist(
      (set) => ({
        users: [],
        isLoading: true,
        getUsers: async () => {
          set({ isLoading: true });
          set({ users: await getUsersAction(), isLoading: false });
        },
        createUser: async (formData) => {
          set({ isLoading: true });
          const { status, errors, data } = await createUserAction(formData);
          if (status === "success") {
            set(produce((state) => state.users.push(data.user)));
          }

          set({ isLoading: false });
          return { errors };
        },
      }),
      {
        name: "users",
      }
    )
  )
);
