import { ApolloServer } from "apollo-server";
import { applyMiddleware } from "graphql-middleware";
import { buildFederatedSchema } from "@apollo/federation";

import { initDeleteProfileQueue, onDeleteProfile } from "./queues";
import ContentDataSource from "./datasources/ContentDataSource";
import initMongoose from "../../config/mongoose";
import permissions from "./permissions";

import AgeClass from "../../models/AgeClass";
import Athlete from "../../models/Athlete";
import AthleteGroup from "../../models/AthleteGroup";
import Attempt from "../../models/Attempt";
import Event from "../../models/Event";
import Official from "../../models/Official";
import OfficialSlot from "../../models/OfficialSlot";
import Slot from "../../models/Slot";
import User from "../../models/User";
import WeightClass from "../../models/WeightClass";

import Post from "../../models/Post";
import Profile from "../../models/Profile";
import Reply from "../../models/Reply";

import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

const runContent = async () => {
  const port = process.env.CONTENT_SERVICE_PORT;
  const deleteProfileQueue = await initDeleteProfileQueue();

  deleteProfileQueue.listen(
    { interval: 5000, maxReceivedCount: 5 },
    onDeleteProfile
  );

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
      return { user };
    },
    dataSources: () => {
      return {
        contentAPI: new ContentDataSource({
          AgeClass,
          Athlete,
          AthleteGroup,
          Attempt,
          Event,
          Official,
          OfficialSlot,
          Slot,
          User,
          WeightClass,

          Post,
          Profile,
          Reply,
        }),
      };
    },
  });

  initMongoose();

  const { url } = await server.listen({ port });
  console.log(`Content service ready at ${url}`);
};

runContent().catch(console.error);
