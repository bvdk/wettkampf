import {Field, ID, InputType, ObjectType} from "type-graphql";
import {Official} from "./official";
import {Slot} from "./slot";

@ObjectType()
export class OfficialSlot {

    @Field((type) => ID)
    public id: string;

    @Field((type) => ID)
    public officialId: string;

    @Field((type) => Official)
    public official: Official;

    @Field((type) => ID)
    public slotId: string;

    @Field((type) => Slot)
    public slot: Slot;

    @Field()
    public position: string;

}

@InputType()
export class OfficialSlotInput {

    @Field()
    public position: string;

}
