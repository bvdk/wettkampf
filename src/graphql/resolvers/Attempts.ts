import {Context} from "graphql-yoga/dist/types";
import {Arg, Args, ArgsType, Ctx, Field, ID, Mutation, Query, Resolver} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import { Attempt, AttemptInput, AttemptUpdateInput} from "../models/attempt";
import IdArgs from "./args/IdArgs";

@ArgsType()
class CreateAttemptArgs {
    @Field((type) => ID)
    public athleteId: string;

    @Field((type) => AttemptInput)
    public data: AttemptInput;
}


@Resolver()
export default class AttemptsResolver {

    private collectionKey: string = Attempt.collectionKey;

    @Query((returns) => Attempt)
    public attempt(
        @Args() {id}: IdArgs,
    ): Attempt {
        return CrudAdapter.getItem(this.collectionKey, id);
    }

    @Mutation()
    public createAttempt(
        @Args() {data, athleteId}: CreateAttemptArgs,
        @Ctx() ctx: Context,
    ): Attempt {
        return CrudAdapter.insertItem(this.collectionKey, {
            date: new Date(),
            ...data,
            athleteId,
        });
    }

    @Mutation()
    public updateAttempt(

        @Args() {id}: IdArgs,
        @Arg("data") data: AttemptUpdateInput,
        @Ctx() ctx: Context,
    ): Attempt {

        return CrudAdapter.updateItem(this.collectionKey, id, data);
    }

    @Mutation()
    public deleteAttempt(
        @Args() {id}: IdArgs,
        @Ctx() ctx: Context,
    ): Attempt {

        return CrudAdapter.removeItem(this.collectionKey, id);
    }

}
