import {Field, ID, InputType, Int, ObjectType} from "type-graphql";
import {Athlete} from "./athlete";
import {AthleteGroup} from "./athleteGroup";
import {ContestType} from "./contentType";
import {Discipline} from "./discipline";
import {Official} from "./official";
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

    @Field((type) => [Discipline], { nullable: true })
    public availableDisciplines?: Discipline[];

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

    @Field((type) => [AthleteGroup])
    public athleteGroups: AthleteGroup[];

    @Field((type) => [Athlete], {description: "Athletes without valid group"})
    public unsortedAthletes: Athlete[];

    @Field((type) => [Athlete])
    public athletes: Athlete[];

    @Field((type) => [Official])
    public officials: Official[];

}

@InputType()
export class EventInput {

    @Field({ nullable: true })
    public name?: string;

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
