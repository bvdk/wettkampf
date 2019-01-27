import {Context} from "graphql-yoga/dist/types";
import {Arg, Args, ArgsType, Ctx, Field, ID, Mutation, Query, Resolver} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import * as _ from "lodash";
import {AthleteGroup, AthleteGroupInput} from "../models/athleteGroup";
import IdArgs from "./args/IdArgs";
import EventsResolver from "./Events";
import EventResolver from "./Event";

@ArgsType()
class CreateAthleteGroupArgs {
    @Field((type) => ID)
    public eventId: string;

    @Field((type) => ID, {nullable: true})
    public slotId: string;

    @Field((type) => AthleteGroupInput)
    public data?: AthleteGroupInput;
}

@ArgsType()
class SetAthleteGroupSlotArgs {
    @Field((type) => ID)
    public athleteGroupId: string;

    @Field((type) => ID)
    public slotId: string;
}


@Resolver()
export default class AthleteGroupsResolver {

    private collectionKey: string = AthleteGroup.collectionKey;

    @Mutation()
    public createAthleteGroup(
        @Args() {data, slotId, eventId}: CreateAthleteGroupArgs,
        @Ctx() ctx: Context,
    ): AthleteGroup {

        if (!slotId) {
            const eventsResolver = new EventsResolver();
            const event = eventsResolver.event({id: eventId});
            const eventResolver = new EventResolver();
            const slots = eventResolver.slots(event);
            slotId = _.chain(slots).first().get("id").value();
        }

        return CrudAdapter.insertItem(this.collectionKey, {
            ...data,
            eventId,
            slotId,
        });
    }

    @Mutation()
    public updateAthleteGroup(

        @Args() {id}: IdArgs,
        @Arg("data") data: AthleteGroupInput,
        @Ctx() ctx: Context,
    ): AthleteGroup {

        return CrudAdapter.updateItem(this.collectionKey, id, data);
    }

    @Mutation()
    public setAthleteGroupSlot(

        @Args() {athleteGroupId, slotId}: SetAthleteGroupSlotArgs,
        @Ctx() ctx: Context,
    ): AthleteGroup {

        return CrudAdapter.updateItem(this.collectionKey, athleteGroupId, {
            slotId,
        });
    }

    @Mutation()
    public deleteAthleteGroup(
        @Args() {id}: IdArgs,
        @Ctx() ctx: Context,
    ): AthleteGroup {

        return CrudAdapter.removeItem(this.collectionKey, id);
    }


}
