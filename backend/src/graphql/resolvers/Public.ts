import {
  Args,
  ArgsType,
  Field,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  Subscription
} from "type-graphql";
import getPublicConfigInstance from "../getPublicConfigInstance";
import { PublicConfig } from "../models/publicConfig";

@ArgsType()
class SetEventIdArgs {
  @Field(type => String)
  public eventId: string;
}

@Resolver()
export default class PublicResolver {
  @Subscription(returns => PublicConfig, {
    topics: "PUBLIC_CONFIG_CHANGED"
  })
  public subscribePublicConfig() {
    const publicConfig = getPublicConfigInstance();
    return {
      eventId: publicConfig.getEventId()
    };
  }

  @Mutation(returns => PublicConfig)
  public setEventID(
    @Args() { eventId }: SetEventIdArgs,
    @PubSub("PUBLIC_CONFIG_CHANGED") publish: Publisher<{}>
  ) {
    const publicConfig = getPublicConfigInstance();
    publicConfig.setEventId(eventId);
    publish({});
    return {
      eventId: publicConfig.getEventId()
    };
  }
}
