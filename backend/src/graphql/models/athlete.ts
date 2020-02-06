import GraphQLJSON from "graphql-type-json";
import { Field, Float, ID, InputType, Int, ObjectType } from "type-graphql";
import { AgeClass } from "./ageClass";
import { AthleteGroup } from "./athleteGroup";
import { Attempt } from "./attempt";
import { Event } from "./event";
import { Gender } from "./gender";
import { ResultClass } from "./resultClass";
import { Slot } from "./slot";
import { WeightClass } from "./weightClass";

@ObjectType()
export class Athlete {
  public static collectionKey: string = "athletes";

  @Field(type => ID)
  public id: string;

  @Field(type => ID)
  public eventId?: string;

  @Field(type => Event)
  public event?: Event;

  @Field(type => ID, { nullable: true })
  public athleteGroupId?: string;

  @Field(type => AthleteGroup, { nullable: true })
  public athleteGroup?: AthleteGroup;

  @Field(type => Slot, { nullable: true })
  public slot?: Slot;

  @Field({ nullable: true })
  public importId?: string;

  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field()
  public name: string;

  @Field(type => Gender)
  public gender: Gender;

  @Field(type => Date, { nullable: true })
  public birthday?: Date | string;

  @Field({ nullable: true })
  public club?: string;

  @Field({ nullable: true })
  public norm?: boolean;

  @Field({ nullable: true })
  public lateRegistration?: boolean;

  @Field({ nullable: true })
  public price?: string;

  @Field(type => Int, { nullable: true })
  public age?: number;

  @Field(type => ID, { nullable: true })
  public ageClassId?: string;

  @Field(type => AgeClass, { nullable: true })
  public ageClass?: AgeClass;

  @Field(type => Float, { description: "Body weight in kg", nullable: true })
  public bodyWeight?: number;

  @Field(type => ID, { nullable: true })
  public weightClassId?: string;

  @Field(type => WeightClass, { nullable: true })
  public weightClass?: WeightClass;

  @Field(type => Int, { description: "Attempt count" })
  public attemptCount: number;

  @Field(type => Float, { description: "Calc wilks", nullable: true })
  public wilks?: number;

  @Field(type => Float, { description: "Calc dots", nullable: true })
  public dots?: number;

  @Field(type => Int, { nullable: true })
  public los?: number;

  @Field(type => Float, { nullable: true })
  public points?: number;

  @Field(type => Float, { nullable: true })
  public total?: number;

  @Field(type => Int, { nullable: true })
  public place?: number;

  @Field(type => String, { nullable: true })
  public location?: string;

  @Field(type => [Attempt])
  public attempts: Attempt[];

  @Field(type => [Attempt], { nullable: true })
  public nextAttempts?: Attempt[];

  @Field(type => [Attempt], { nullable: true })
  public bestAttempts?: Attempt[];

  @Field(type => Boolean, { nullable: true })
  public valid?: boolean;

  @Field(type => GraphQLJSON, { nullable: true })
  public nextAttemptsSortKeys?: {
    [key: string]: string;
  };

  @Field(type => ResultClass, { nullable: true })
  public resultClass: ResultClass;

  @Field(type => Boolean, { nullable: true })
  public raw?: boolean;

  public latestBestAttemptsDate?: string;
}

@InputType()
export class AthleteInput implements Partial<Athlete> {
  @Field({ nullable: true })
  public importId?: string;

  @Field(type => ID, { nullable: true })
  public athleteGroupId?: string;

  @Field({ nullable: true })
  public firstName?: string;

  @Field({ nullable: true })
  public lastName?: string;

  @Field(type => Gender, { nullable: true })
  public gender?: Gender;

  @Field(type => Date, { nullable: true })
  public birthday?: Date;

  @Field({ nullable: true })
  public club?: string;

  @Field({ nullable: true })
  public norm?: boolean;

  @Field({ nullable: true })
  public lateRegistration?: boolean;

  @Field({ nullable: true })
  public price?: string;

  // Auto calc with birthday
  @Field(type => ID, { nullable: true })
  public ageClassId?: string;

  @Field(type => Float, { description: "Body weight in kg", nullable: true })
  public bodyWeight?: number;

  // Auto calc with bodyweight
  @Field({ nullable: true })
  public weightClassId?: string;

  @Field(type => Int, { nullable: true })
  public los?: number;

  @Field({ nullable: true })
  public raw?: boolean;

  public latestBestAttemptsDate?: string;
}

@InputType()
export class AthleteUpdateInput extends AthleteInput
  implements Partial<Athlete> {
  @Field({ nullable: true })
  public firstName?: string;

  @Field({ nullable: true })
  public lastName?: string;

  @Field(type => Gender, { nullable: true })
  public gender?: Gender;

  public wilks?: number;

  public dots?: number;

  public total?: number;

  public points?: number;

  public latestBestAttemptsDate?: string;

  public nextAttemptsSortKeys?: {
    [key: string]: string;
  };

  @Field({ nullable: true })
  public raw?: boolean;
}
