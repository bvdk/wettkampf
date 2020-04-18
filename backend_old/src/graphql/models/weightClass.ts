import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import { Gender } from "./gender";

@ObjectType()
export class WeightClass {
  public static collectionKey: string = "weightClasses";

  @Field(type => ID)
  public id: string;

  @Field()
  public name: string;

  @Field(type => Int)
  public min: number;

  @Field(type => Int)
  public max: number;

  @Field(type => Gender, { nullable: true })
  public gender: Gender;
}

@InputType()
export class WeightClassInput {
  @Field({ nullable: true })
  public name: string;

  @Field(type => Int)
  public min: number;

  @Field(type => Int)
  public max: number;

  @Field(type => Gender, { nullable: true })
  public gender: Gender;
}
