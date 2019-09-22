import { Field, Float, ID, InputType, Int, ObjectType } from "type-graphql";
import { Athlete } from "./athlete";
import { Discipline } from "./discipline";
import { Gender } from "./gender";

@ObjectType()
export class Attempt {
  public static collectionKey: string = "attempts";

  @Field(type => ID)
  public id: string;

  public athleteId: string;

  @Field(type => Float, { nullable: true })
  public weight?: number;

  @Field()
  public valid?: boolean;

  @Field()
  public done?: boolean;

  @Field()
  public date: Date;

  @Field(type => Discipline)
  public discipline: Discipline;

  @Field(type => Int)
  public index: number;

  @Field(type => Boolean, { nullable: true })
  public raw?: boolean;
}

@InputType()
export class AttemptInput implements Partial<Attempt> {
  @Field(type => Float, { nullable: true })
  public weight?: number;

  @Field({ nullable: true })
  public valid?: boolean;

  @Field({ nullable: true })
  public done?: boolean;

  @Field({ nullable: true })
  public date?: Date;

  @Field(type => Boolean, { nullable: true })
  public raw?: boolean;
}

@InputType()
export class AttemptUpdateInput extends AttemptInput
  implements Partial<Attempt> {
  @Field(type => Float, { nullable: true })
  public weight: number;
}
