import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class System {
  @Field(type => ID)
  public id: string;

  @Field(type => String)
  public version: string;

  @Field(type => String)
  public name: string;
}
