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
import { OfficialSlot, OfficialSlotInput } from "../models/officialSlot";
import IdArgs from "./args/IdArgs";

@ArgsType()
class CreateOfficialSlotArgs {
  @Field(type => ID)
  public slotId: string;

  @Field(type => ID)
  public officialId: string;

  @Field(type => OfficialSlotInput, { nullable: true })
  public input?: OfficialSlotInput;
}

@Resolver()
export default class OfficialSlotsResolver {
  private collectionKey: string = CollectionKeys.officialSlots;

  @Query(returns => OfficialSlot, {
    nullable: true,
    description: "Get a OfficialSlot"
  })
  public officialSlot(@Args() { id }: IdArgs): OfficialSlot {
    return CrudAdapter.getItem(this.collectionKey, id);
  }

  @Mutation()
  public createOfficialSlot(@Args()
  {
    input,
    officialId,
    slotId
  }: CreateOfficialSlotArgs): OfficialSlot {
    const official = CrudAdapter.insertItem(this.collectionKey, {
      ...input,
      officialId,
      slotId
    });

    return official;
  }

  @Mutation()
  public updateOfficialSlot(
    @Args() { id }: IdArgs,
    @Arg("input") input: OfficialSlotInput
  ): OfficialSlot {
    return CrudAdapter.updateItem(this.collectionKey, id, input);
  }

  @Mutation()
  public deleteOfficialSlot(@Args() { id }: IdArgs): OfficialSlot {
    return CrudAdapter.removeItem(this.collectionKey, id);
  }
}
