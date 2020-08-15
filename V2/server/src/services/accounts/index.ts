import { ApolloServer } from "apollo-server";
import { applyMiddleware } from "graphql-middleware";
import { buildFederatedSchema } from "@apollo/federation";

import { initDeleteAccountQueue } from "./queues";
import AccountsDataSource from "./datasources/AccountsDataSource";
import permissions from "./permissions";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import User from "../../models/User";
import { Datasource } from "./types";

const runAccounts = async () => {
  const port = process.env.ACCOUNTS_SERVICE_PORT;
  const deleteAccountQueue = await initDeleteAccountQueue();

  const schema = applyMiddleware(
    buildFederatedSchema([{ typeDefs, resolvers } as any]),
    permissions
  );

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const user = req.headers.user
        ? JSON.parse(req.headers.user as string)
        : null;
      return { user, queues: { deleteAccountQueue } };
    },
    dataSources: (): Datasource => {
      return {
        accountsAPI: new AccountsDataSource({
          UserModel: User,
        }),
      };
    },
  });

  const { url } = await server.listen({ port });
  console.log(`Accounts service ready at ${url}`);
};

runAccounts().catch(console.error);
