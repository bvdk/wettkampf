import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import { Athlete } from "./athlete";
import { AthleteGroup } from "./athleteGroup";
import { Discipline } from "./discipline";
import { Event } from "./event";
import { OfficialSlot } from "./officialSlot";

@ObjectType()
export class Slot {
  public static collectionKey: string = "slots";

  @Field(type => ID)
  public id: string;

  @Field()
  public name: string;

  @Field(type => Event)
  public event: Event;

  @Field()
  public eventId: string;

  @Field(type => ID, { nullable: true })
  public activeAthleteGroupId?: string;

  @Field(type => AthleteGroup, { nullable: true })
  public activeAthleteGroup?: AthleteGroup;

  @Field(type => Discipline, { nullable: true })
  public activeDiscipline?: Discipline;

  @Field(type => Int)
  public index: number;

  @Field(type => Athlete)
  public athletes: Athlete[];

  @Field(type => Athlete)
  public nextAthletes: Athlete[];

  @Field(type => Int)
  public athleteCount: number;

  @Field(type => AthleteGroup)
  public athleteGroups: AthleteGroup[];

  @Field(type => OfficialSlot)
  public officialSlots: OfficialSlot[];
}

@InputType()
export class SlotInput {
  @Field({ nullable: true })
  public name?: string;

  @Field(type => ID, { nullable: true })
  public activeAthleteGroupId?: string;

  @Field(type => Discipline, { nullable: true })
  public activeDiscipline?: Discipline;
}
