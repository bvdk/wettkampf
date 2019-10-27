import { Context } from "graphql-yoga/dist/types";
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  ID,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import { CrudAdapter } from "../../database/CrudAdapter";
import { Slot, SlotInput } from "../models/slot";
import { IdArgs } from "./args/IdArgs";
import AthleteGroupsResolver from "./AthleteGroups";

@ArgsType()
class CreateSlotArgs {
  @Field(type => ID)
  public eventId: string;

  @Field(type => SlotInput)
  public data?: SlotInput;
}

@Resolver()
export default class SlotsResolver {
  private collectionKey: string = Slot.collectionKey;

  @Query(returns => Slot, { nullable: true, description: "Get a slot" })
  public slot(@Args() { id }: IdArgs): Slot {
    return CrudAdapter.getItem(this.collectionKey, id);
  }

  @Mutation()
  public createSlot(
    @Args() { data, eventId }: CreateSlotArgs,
    @Ctx() ctx: Context
  ): Slot {
    const countSlots = CrudAdapter.filter(this.collectionKey, { eventId });
    const slot = CrudAdapter.insertItem(this.collectionKey, {
      name: `Bühne ${countSlots.length + 1}`,
      ...data,
      eventId
    });

    const athleteGroupsResolver = new AthleteGroupsResolver();
    athleteGroupsResolver.createAthleteGroup(
      {
        data: {
          name: "Startgruppe 1"
        },
        eventId: slot.eventId,
        slotId: slot.id
      },
      ctx
    );

    return slot;
  }

  @Mutation()
  public updateSlot(
    @Args() { id }: IdArgs,
    @Arg("data") data: SlotInput,
    @Ctx() ctx: Context
  ): Slot {
    return CrudAdapter.updateItem(this.collectionKey, id, data);
  }

  // @TODO: [TM] Wenn ein Slot gelöscht wird sollten alle AthleteGroups in eine andere Verschoben werden
  // @TODO: [TM] Der letzte Slot darf nicht gelöscht werden
  @Mutation()
  public deleteSlot(@Args() { id }: IdArgs, @Ctx() ctx: Context): Slot {
    return CrudAdapter.removeItem(this.collectionKey, id);
  }
}
