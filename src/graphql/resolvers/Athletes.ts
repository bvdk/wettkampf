import {Context} from "graphql-yoga/dist/types";
import {Arg, Args, ArgsType, Ctx, Field, ID, Mutation, Query, Resolver} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import { Athlete, AthleteInput, AthleteUpdateInput} from "../models/athlete";
import IdArgs from "./args/IdArgs";

@ArgsType()
class CreateAthleteArgs {
    @Field((type) => ID)
    public eventId: string;

    @Field((type) => AthleteInput)
    public data: AthleteInput;
}


@ArgsType()
class FindAthleteArgs {
    @Field((type) => ID)
    public importId: string;

}


@Resolver()
export default class AthletesResolver {

    private collectionKey: string = Athlete.collectionKey;

    @Query((returns) => [Athlete] )
    public athletes(): Athlete[] {
        return CrudAdapter.getAll(this.collectionKey);
    }

    @Query((returns) => Athlete)
    public athlete(
        @Args() {id}: IdArgs,
    ): Athlete {
        return CrudAdapter.getItem(this.collectionKey, id);
    }

    @Query((returns) => Athlete)
    public findAthlete(
        @Args() args: FindAthleteArgs,
    ): Athlete {
        return CrudAdapter.find(this.collectionKey, args);
    }

    @Mutation()
    public createAthlete(
        @Args() {data, eventId}: CreateAthleteArgs,
        @Ctx() ctx: Context,
    ): Athlete {
        return CrudAdapter.insertItem(this.collectionKey, {
            ...data,
            eventId,
        });
    }

    @Mutation()
    public updateAthlete(

        @Args() {id}: IdArgs,
        @Arg("data") data: AthleteUpdateInput,
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
