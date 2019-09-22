import {
  Arg,
  Args,
  ArgsType,
  Field,
  ID,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import { CollectionKeys } from "../../database";
import { CrudAdapter } from "../../database/CrudAdapter";
import { Official, OfficialInput } from "../models/official";
import IdArgs from "./args/IdArgs";

@ArgsType()
class CreateOfficialArgs {
  @Field(type => ID)
  public eventId: string;

  @Field(type => OfficialInput)
  public data?: OfficialInput;
}

@ArgsType()
class FindOfficialArgs {
  @Field(type => ID, { nullable: true })
  public eventId?: string;

  @Field(type => ID, { nullable: true })
  public importId?: string;
}

@Resolver()
export default class OfficialsResolver {
  private collectionKey: string = CollectionKeys.officials;

  @Query(returns => Official, { nullable: true, description: "Get a Official" })
  public official(@Args() { id }: IdArgs): Official {
    return CrudAdapter.getItem(this.collectionKey, id);
  }

  @Mutation()
  public createOfficial(@Args()
  {
    data,
    eventId
  }: CreateOfficialArgs): Official {
    const official = CrudAdapter.insertItem(this.collectionKey, {
      ...data,
      eventId
    });

    return official;
  }

  @Query(returns => Official)
  public findOfficial(@Args() args: FindOfficialArgs): Official {
    return CrudAdapter.find(this.collectionKey, args);
  }

  @Mutation()
  public updateOfficial(
    @Args() { id }: IdArgs,
    @Arg("data") data: OfficialInput
  ): Official {
    return CrudAdapter.updateItem(this.collectionKey, id, data);
  }

  @Mutation()
  public deleteOfficial(@Args() { id }: IdArgs): Official {
    return CrudAdapter.removeItem(this.collectionKey, id);
  }
}
