import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { CollectionKeys } from "../../database";
import { CrudAdapter } from "../../database/CrudAdapter";
import { OfficialSlot } from "../models/officialSlot";

@Resolver(of => OfficialSlot)
export default class OfficialSlotResolver
  implements ResolverInterface<OfficialSlot> {
  @FieldResolver()
  public slot(@Root() officialSlot: OfficialSlot) {
    return CrudAdapter.getItem(CollectionKeys.slots, officialSlot.slotId);
  }

  @FieldResolver()
  public official(@Root() officialSlot: OfficialSlot) {
    return CrudAdapter.getItem(
      CollectionKeys.officials,
      officialSlot.officialId
    );
  }
}
