import {Field, ID, InputType, Int, ObjectType} from "type-graphql";
import {ContestType} from "./contentType";
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

    @Field((type) => Discipline, { nullable: true })
    public discipline?: Discipline;

    @Field((type) => ContestType, { nullable: true })
    public contestType?: ContestType;

    @Field((type) => Gender, { nullable: true })
    public teamGender?: Gender;

    @Field((type) => Int, { nullable: true })
    public teamSize?: number;

    @Field((type) => [String], { nullable: true })
    public groupOrder?: string[];

    @Field((type) => Discipline, { nullable: true })
    public currentDiscipline?: Discipline;

    @Field((type) => [Slot])
    public slots: Slot[];

}

@InputType()
export class EventInput implements Partial<Event> {

    @Field({ nullable: true })
    public name: string;

    @Field((type) => Discipline, { nullable: true })
    public discipline?: Discipline;

    @Field((type) => ContestType, { nullable: true })
    public contestType?: ContestType;

    @Field((type) => Gender, { nullable: true })
    public teamGender?: Gender;

    @Field((type) => Int, { nullable: true })
    public teamSize?: number;

    @Field((type) => Discipline, { nullable: true })
    public currentDiscipline?: Discipline;

}
