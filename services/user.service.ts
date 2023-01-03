import {
  UserEntity,
  User,
  UserCompositeKey,
  CreateUserInput,
  UpdateUserInput,
} from "models";
import { createOrderedUid } from "utils";

interface IUserService {
  getUserById: (userId: string) => Promise<User | undefined>;
  getUserByEmail: (email: string) => Promise<User | undefined>;
  getUsersByOrganizationId: (organizationId: string) => Promise<User[]>;
  createUser: (userAttrs: CreateUserInput) => Promise<User>;
  updateUser: (userId: string, userAttrs: UpdateUserInput) => Promise<User>;
  deleteUser: (userId: string) => Promise<User>;
}

export class UserService implements IUserService {
  constructor() {}

  public async getUserById(userId: string) {
    const GSI1PK = `USER#${userId}`;
    const { Items: users } = await UserEntity.query(GSI1PK, {
      index: "GSI1PK",
      limit: 1,
    });
    return users ? users[0] : undefined;
  }

  public async getUserByEmail(email: string) {
    const GSI2PK = `EMAIL#${email}`;
    const { Items: users } = await UserEntity.query(GSI2PK, {
      index: "GSI2",
      limit: 1,
    });
    return users ? users[0] : undefined;
  }

  public async getUsersByOrganizationId(organizationId: string) {
    const PK = `ORG#${organizationId}`;
    const { Items: users } = await UserEntity.query(PK, {
      beginsWith: "USER#",
    });
    return users ? users : [];
  }

  public async createUser(userAttrs: CreateUserInput) {
    const userId = createOrderedUid();
    const newUser = {
      ...userAttrs,
      userId,
      isAdmin: false,
    };
    await UserEntity.put(newUser);
    return newUser;
  }

  public async updateUser(userId: string, userAttrs: UpdateUserInput) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    const { organizationId } = user;

    await UserEntity.update<UpdateUserInput & UserCompositeKey>({
      userId,
      organizationId,
      ...userAttrs,
    });

    return { ...user, ...userAttrs };
  }

  public async deleteUser(userId: string) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    const { organizationId } = user;

    await UserEntity.delete({ userId, organizationId });
    return user;
  }
}
