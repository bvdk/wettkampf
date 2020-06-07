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
import { AgeClass, AgeClassInput } from "../models/ageClass";
import { IdArgs } from "./args/IdArgs";

@ArgsType()
class CreateAgeClassArgs {
  @Field(type => AgeClassInput)
  public data?: AgeClassInput;
}

@Resolver()
export default class AgeClassesResolver {
  private collectionKey: string = AgeClass.collectionKey;

  @Query(returns => [AgeClass], { description: "All age classes" })
  public ageClasses(): AgeClass[] {
    return CrudAdapter.getAll(this.collectionKey);
  }

  @Query(returns => AgeClass)
  public ageClass(@Args() { id }: IdArgs): AgeClass {
    return CrudAdapter.getItem(this.collectionKey, id);
  }

  @Mutation()
  public createAgeClass(
    @Args() { data }: CreateAgeClassArgs,
    @Ctx() ctx: Context
  ): AgeClass {
    return CrudAdapter.insertItem(this.collectionKey, {
      ...data
    });
  }

  @Mutation()
  public updateAgeClass(
    @Args() { id }: IdArgs,
    @Arg("data") data: AgeClassInput,
    @Ctx() ctx: Context
  ): AgeClass {
    return CrudAdapter.updateItem(this.collectionKey, id, data);
  }

  @Mutation()
  public deleteAgeClass(@Args() { id }: IdArgs, @Ctx() ctx: Context): AgeClass {
    return CrudAdapter.removeItem(this.collectionKey, id);
  }
}
