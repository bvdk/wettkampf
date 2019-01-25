import {Field, ID, InputType, Int, ObjectType} from "type-graphql";
import { Athlete } from "./athlete";
import {Event} from "./event";
import {AthleteGroup} from "./athleteGroup";

@ObjectType()
export class Slot {

    public static collectionKey: string = "slots";

    @Field((type) => ID)
    public id: string;

    @Field()
    public name: string;

    @Field((type) => Event)
    public event: Event;

    @Field()
    public eventId: string;

    @Field((type) => Int)
    public index: number;

    @Field((type) => Athlete)
    public athletes: Athlete[];

    @Field((type) => AthleteGroup)
    public athleteGroups: AthleteGroup[];
}

@InputType()
export class SlotInput {

    @Field({nullable: true})
    public name: string;

}
