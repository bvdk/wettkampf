import { DateTimeResolver } from "../../lib/customScalars";
import jwt from "jsonwebtoken";
import { Datasource } from "./types";

const resolvers = {
  DateTime: DateTimeResolver,

  Account: {
    __resolveReference(
      reference,
      { dataSources }: { dataSources: Datasource }
    ) {
      return dataSources.accountsAPI.getAccountById(reference.id);
    },
    id(account) {
      return account.user_id;
    },
    createdAt(account) {
      return account.created_at;
    },
    isBlocked(account) {
      return account.blocked;
    },
    isAdmin(account) {
      return (
        account.app_metadata &&
        account.app_metadata.roles &&
        account.app_metadata.roles.includes("admin")
      );
    },
  },

  Query: {
    account(_, { id }, { dataSources }: { dataSources: Datasource }, info) {
      return dataSources.accountsAPI.getAccountById(id);
    },
    accounts(parent, args, { dataSources }: { dataSources: Datasource }, info) {
      return dataSources.accountsAPI.getAccounts();
    },
    viewer(
      parent,
      args,
      { dataSources, user }: { dataSources: Datasource; user: any },
      info
    ) {
      if (user && user.sub) {
        return dataSources.accountsAPI.getAccountById(user.sub);
      }
      return null;
    },
  },

  Mutation: {
    async login(
      _,
      { email, password },
      { dataSources }: { dataSources: Datasource }
    ) {
      const { id, role } = await dataSources.accountsAPI.findOne(
        (account) =>
          account.username === email && account.passwordHash === password
      );
      return jwt.sign(
        { "https://awesomeapi.com/graphql": { role } },
        "f1BtnWgD3VKY",
        { algorithm: "HS256", subject: id, expiresIn: "1d" }
      );
    },
    changeAccountAdminRole(
      parent,
      { where: { id } },
      { dataSources }: { dataSources: Datasource }
    ) {
      return dataSources.accountsAPI.changeAccountAdminRole(id);
    },
    createAccount(
      parent,
      { data: { email, password } },
      { dataSources }: { dataSources: Datasource }
    ) {
      return dataSources.accountsAPI.createAccount(email, password);
    },
    async deleteAccount(
      parent,
      { where: { id } },
      { dataSources, queues }: { dataSources: Datasource; queues: any }
    ) {
      const accountDeleted = await dataSources.accountsAPI.deleteAccount(id);

      if (accountDeleted) {
        await queues.deleteAccountQueue.sendMessage(
          JSON.stringify({ accountId: id })
        );
      }

      return accountDeleted;
    },
    updateAccount(
      parent,
      { data, where: { id } },
      { dataSources }: { dataSources: Datasource }
    ) {
      return dataSources.accountsAPI.updateAccount(id, data);
    },
  },
};

export default resolvers;
