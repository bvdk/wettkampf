import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";
import * as DataLoader from "dataloader";
import { pbkdf2Sync, randomBytes } from "crypto";

import getToken from "../../../lib/getToken";
import User from "../../../models/User";
import Role from "../../../enums/Role";
import { Model } from "mongoose";

class AccountsDataSource extends DataSource {
  userPermissions = [
    "read:own_account",
    "edit:own_account",
    "read:any_profile",
    "edit:own_profile",
    "read:any_content",
    "edit:own_content",
    "upload:own_media",
  ];

  adminPermissions = [
    "read:any_account",
    "block:any_accounts",
    "promote:any_accounts",
    "block:any_content",
  ];

  private UserModel: Model<User, {}>;

  _accountByIdLoader = new DataLoader(async (ids) => {
    const accounts = await User.find({
      id: {
        $in: ids,
      },
    }).exec();

    return ids.map((id) => accounts.find((account: User) => account.id === id));
  });

  constructor({ UserModel }: { UserModel: Model<User, {}> }) {
    super();
    this.UserModel = UserModel;
  }

  // CREATE

  async createAccount(username: string, password: string) {
    const salt = randomBytes(16).toString("base64");
    const passwordHash = pbkdf2Sync(
      password,
      salt,
      1000,
      64,
      `sha512`
    ).toString(`hex`);

    const account = new User({
      createdAt: new Date(),
      updatedAt: new Date(),
      username,
      passwordHash,
      salt,
      role: Role.ADMIN,
    });

    return account.save();
  }

  // READ
  async findOne(cb: (account: User) => boolean): Promise<User | undefined> {
    const users = await User.find(cb).exec();
    return users[0];
  }

  getAccountById(id: string) {
    return this._accountByIdLoader.load(id);
  }

  getAccounts() {
    return User.find().exec();
  }

  // UPDATE

  async changeAccountAdminRole(id: string) {
    const user = await User.findById(id);

    return user
      .update({
        role: user.role === Role.ADMIN ? Role.USER : Role.ADMIN,
      })
      .exec();
  }

  async updateAccount(
    id: string,
    {
      username,
      newPassword,
      password,
    }: { username: string; newPassword: string; password: string }
  ) {
    if (!username && !newPassword && !password) {
      throw new UserInputError("You must supply some account data to update.");
    } else if (username && newPassword && password) {
      throw new UserInputError(
        "Email and password cannot be updated simultaneously."
      );
    } else if ((!password && newPassword) || (password && !newPassword)) {
      throw new UserInputError(
        "Provide the existing and new passwords when updating the password."
      );
    }

    const user = await User.findById(id);
    if (!username) {
      await getToken(user.username, password);
      return user.update({ password: newPassword }).exec();
    }

    return user.update({ username }).exec();
  }

  // DELETE

  async deleteAccount(id: string) {
    await User.deleteOne({ id }).exec();
    // await this.auth0.deleteUser({ id });
    return true;
  }
}

export default AccountsDataSource;
