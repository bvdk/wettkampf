import { Context } from "graphql-yoga/dist/types";
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import { CrudAdapter } from "../../database/CrudAdapter";
import { WeightClass, WeightClassInput } from "../models/weightClass";
import { IdArgs } from "./args/IdArgs";

@ArgsType()
class CreateWeightClassArgs {
  @Field(type => WeightClassInput)
  public data?: WeightClassInput;
}

@Resolver()
export default class WeightClassesResolver {
  private collectionKey: string = WeightClass.collectionKey;

  @Query(returns => [WeightClass], { description: "All weight classes" })
  public weightClasses(): WeightClass[] {
    return CrudAdapter.getAll(this.collectionKey);
  }

  @Query(returns => WeightClass)
  public weightClass(@Args() { id }: IdArgs): WeightClass {
    return CrudAdapter.getItem(this.collectionKey, id);
  }

  @Mutation()
  public createWeightClass(
    @Args() { data }: CreateWeightClassArgs,
    @Ctx() ctx: Context
  ): WeightClass {
    return CrudAdapter.insertItem(this.collectionKey, {
      ...data
    });
  }

  @Mutation()
  public updateWeightClass(
    @Args() { id }: IdArgs,
    @Arg("data") data: WeightClassInput,
    @Ctx() ctx: Context
  ): WeightClass {
    return CrudAdapter.updateItem(this.collectionKey, id, data);
  }

  @Mutation()
  public deleteWeightClass(
    @Args() { id }: IdArgs,
    @Ctx() ctx: Context
  ): WeightClass {
    return CrudAdapter.removeItem(this.collectionKey, id);
  }
}
