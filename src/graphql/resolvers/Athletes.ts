import {Context} from "graphql-yoga/dist/types";
import {Arg, Args, ArgsType, Ctx, Field, ID, Mutation, Query, Resolver} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import Athlete, {AthleteInput} from "../models/athlete";
import IdArgs from "./args/IdArgs";

@ArgsType()
class CreateAthleteArgs {
    @Field((type) => ID)
    public eventId: string;

    @Field((type) => ID, {nullable: true})
    public athleteGroupId?: string;

    @Field((type) => AthleteInput)
    public data: AthleteInput;
}


@Resolver()
export default class AthletesResolver {

    private collectionKey: string = Athlete.collectionKey;

    @Query((returns) => [Athlete], { description: "" })
    public athletes(): Athlete[] {
        return CrudAdapter.getAll(this.collectionKey);
    }

    @Query((returns) => Athlete, { description: "" })
    public event(
        @Args() {id}: IdArgs,
    ): Athlete {
        return CrudAdapter.getItem(this.collectionKey, id);
    }

    @Mutation()
    public createAthlete(
        @Args() {data, eventId, athleteGroupId}: CreateAthleteArgs,
        @Ctx() ctx: Context,
    ): Athlete {
        return CrudAdapter.insertItem(this.collectionKey, {
            ...data,
            athleteGroupId,
            eventId,
        });
    }

    @Mutation()
    public updateAthlete(

        @Args() {id}: IdArgs,
        @Arg("data") data: AthleteInput,
        @Ctx() ctx: Context,
    ): Athlete {

        return CrudAdapter.updateItem(this.collectionKey, id, data);
    }

    @Mutation()
    public deleteAthlete(
        @Args() {id}: IdArgs,
        @Ctx() ctx: Context,
    ): Athlete {

        return CrudAdapter.removeItem(this.collectionKey, id);
    }

}
