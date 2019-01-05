import {Field, ID, Int, ObjectType} from "type-graphql";
import Athlete from "./athlete";
import {Event} from "./event";

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
}
