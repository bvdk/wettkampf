import "reflect-metadata";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";

@ObjectType()
export class AgeClass {
  public static collectionKey: string = "ageClasses";

  @Field(type => ID)
  public id: string;

  @Field()
  public name: string;

  @Field(type => Int)
  public sortId: number;
}

@InputType()
export class AgeClassInput {
  @Field()
  public name: string;
}
