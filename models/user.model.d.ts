type User = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  isAdmin: boolean;
  organizationId: string;
};

type UserCompositeKey = {
  organizationId: string;
  userId: string;
};

type UserCompositeKeyGSI1 = {
  userId: string;
};

type UserCompositeKeyGSI2 = {
  email: string;
};

type CreateUserInput = Omit<User, "userId" | "isAdmin">;

type UpdateUserInput = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  isAdmin?: boolean;
};
