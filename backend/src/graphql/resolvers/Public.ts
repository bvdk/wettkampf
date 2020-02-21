import {
  Args,
  ArgsType,
  Field,
  InputType,
  Mutation,
  Publisher,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription
} from "type-graphql";
import { CrudAdapter } from "../../database/CrudAdapter";
import getPublicConfigInstance from "../getPublicConfigInstance";
import { AthleteGroup } from "../models/athleteGroup";
import { Event } from "../models/event";
import { PublicConfig } from "../models/publicConfig";
import { Slot } from "../models/slot";

@InputType()
export class PublicConfigInput {
  @Field(type => String)
  public eventId: string;

  @Field(type => String)
  public discipline: string;

  @Field(type => String)
  public slotId: string;

  @Field(type => [String])
  public athleteGroupIds: string[];
}

@ArgsType()
class SetEventIdArgs {
  @Field(type => String)
  public eventId: string;
}

@ArgsType()
class SetPublicConfigArgs {
  @Field(type => PublicConfigInput)
  public data: PublicConfigInput;
}

@Resolver()
export default class PublicResolver {
  @Subscription(returns => PublicConfig, {
    topics: "PUBLIC_CONFIG_CHANGED"
  })
  public subscribePublicConfig(@Root() payload: PublicConfig) {
    return this.getPublicConfig();
  }

  @Query(returns => PublicConfig)
  public getPublicConfig() {
    const publicConfig = getPublicConfigInstance();

    return {
      event: publicConfig.getEvent(),
      discipline: publicConfig.getDiscipline(),
      slot: publicConfig.getSlot(),
      athleteGroups: publicConfig.getAthleteGroups(),
      nextAthletes: publicConfig.getNextAthletes()
    };
  }

  @Mutation(returns => PublicConfig)
  public setPublicConfig(
    @Args() { data }: SetPublicConfigArgs,
    @PubSub("PUBLIC_CONFIG_CHANGED") publish: Publisher<{}>
  ) {
    const event = CrudAdapter.find(Event.collectionKey, { id: data.eventId });
    const slot = CrudAdapter.find(Slot.collectionKey, { id: data.slotId });
    const athleteGroups = data.athleteGroupIds.map(id =>
      CrudAdapter.find(AthleteGroup.collectionKey, { id })
    );

    const publicConfig = getPublicConfigInstance();
    publicConfig.setEvent(event);
    publicConfig.setDiscipline(data.discipline);
    publicConfig.setSlot(slot);
    publicConfig.setAthleteGroups(athleteGroups);
    publicConfig.setNextAthletes();

    const returnData = this.getPublicConfig();

    publish(returnData);
    return returnData;
  }
}
