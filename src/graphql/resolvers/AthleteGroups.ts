import {Context} from "graphql-yoga/dist/types";
import {Arg, Args, ArgsType, Ctx, Field, ID, Mutation, Query, Resolver} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import {AthleteGroup, AthleteGroupInput} from "../models/athleteGroup";
import IdArgs from "./args/IdArgs";

@ArgsType()
class CreateAthleteGroupArgs {
    @Field((type) => ID)
    public slotId: string;

    @Field((type) => AthleteGroupInput)
    public data?: AthleteGroupInput;
}


@Resolver()
export default class AthleteGroupsResolver {

    private collectionKey: string = AthleteGroup.collectionKey;

    @Mutation()
    public createAthleteGroup(
        @Args() {data, slotId}: CreateAthleteGroupArgs,
        @Ctx() ctx: Context,
    ): AthleteGroup {
        return CrudAdapter.insertItem(this.collectionKey, {
            ...data,
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
    public deleteAthleteGroup(
        @Args() {id}: IdArgs,
        @Ctx() ctx: Context,
    ): AthleteGroup {

        return CrudAdapter.removeItem(this.collectionKey, id);
    }


}
