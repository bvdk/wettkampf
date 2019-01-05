import {Field, ID, InputType, Int, ObjectType} from "type-graphql";
import {Discipline} from "./discipline";
import {Gender} from "./gender";
import {Slot} from "./slot";

@ObjectType()
export class Event {

    public static collectionKey: string = "events";

    @Field((type) => ID)
    public id: string;

    @Field()
    public name: string;

    @Field()
    public discipline?: Discipline;

    @Field()
    public contestType?: string;

    @Field()
    public teamGender?: Gender;

    @Field((type) => Int)
    public teamSize?: number;

    @Field((type) => [String])
    public groupOrder?: string[];

    @Field()
    public currentDiscipline?: Discipline;

    @Field((type) => [Slot])
    public slots: Slot[];

}

@InputType()
export class EventInput implements Partial<Event> {

    @Field()
    public name: string;

    @Field()
    public discipline?: Discipline;

    @Field()
    public contestType?: string;

    @Field()
    public teamGender?: Gender;

    @Field((type) => Int)
    public teamSize?: number;

    @Field()
    public currentDiscipline?: Discipline;

}
