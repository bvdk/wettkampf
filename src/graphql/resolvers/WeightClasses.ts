import {Context} from "graphql-yoga/dist/types";
import {Arg, Args, ArgsType, Ctx, Field, ID, Mutation, Resolver} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import {WeightClass, WeightClassInput} from "../models/weightClass";
import IdArgs from "./args/IdArgs";

@ArgsType()
class CreateWeightClassArgs {
    @Field((type) => ID)
    public eventId: string;

    @Field((type) => WeightClassInput)
    public data?: WeightClassInput;
}



@Resolver()
export default class WeightClassesResolver {

    private collectionKey: string = WeightClass.collectionKey;

    @Mutation()
    public createWeightClass(
        @Args() {data, eventId}: CreateWeightClassArgs,
        @Ctx() ctx: Context,
    ): WeightClass {
        const weightClass = CrudAdapter.insertItem(this.collectionKey, {
            ...data,
            eventId,
        });

        return weightClass;
    }

    @Mutation()
    public updateWeightClass(

        @Args() {id}: IdArgs,
        @Arg("data") data: WeightClassInput,
        @Ctx() ctx: Context,
    ): WeightClass {

        return CrudAdapter.updateItem(this.collectionKey, id, data);
    }

    @Mutation()
    public deleteWeightClass(
        @Args() {id}: IdArgs,
        @Ctx() ctx: Context,
    ): WeightClass {

        return CrudAdapter.removeItem(this.collectionKey, id);
    }


}
