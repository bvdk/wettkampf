import {Context} from "graphql-yoga/dist/types";
import {Arg, Args, ArgsType, Ctx, Field, ID, Mutation, Resolver} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import {Slot, SlotInput} from "../models/slot";
import IdArgs from "./args/IdArgs";
import AthleteGroupsResolver from "./AthleteGroups";

@ArgsType()
class CreateSlotArgs {
    @Field((type) => ID)
    public eventId: string;

    @Field((type) => SlotInput)
    public data?: SlotInput;
}



@Resolver()
export default class SlotsResolver {

    private collectionKey: string = Slot.collectionKey;

    @Mutation()
    public createSlot(
        @Args() {data, eventId}: CreateSlotArgs,
        @Ctx() ctx: Context,
    ): Slot {
        const slot = CrudAdapter.insertItem(this.collectionKey, {
            ...data,
            eventId,
        });

        const athleteGroupsResolver = new AthleteGroupsResolver();
        athleteGroupsResolver.createAthleteGroup({
            data: {
                name: "Startgruppe 1",
            },
            slotId: slot.id,
        }, ctx);

        return slot;
    }

    @Mutation()
    public updateSlot(

        @Args() {id}: IdArgs,
        @Arg("data") data: SlotInput,
        @Ctx() ctx: Context,
    ): Slot {

        return CrudAdapter.updateItem(this.collectionKey, id, data);
    }

    @Mutation()
    public deleteSlot(
        @Args() {id}: IdArgs,
        @Ctx() ctx: Context,
    ): Slot {

        return CrudAdapter.removeItem(this.collectionKey, id);
    }


}
