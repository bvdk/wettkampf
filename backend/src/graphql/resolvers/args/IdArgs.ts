import { ArgsType, Field, ID } from "type-graphql";

@ArgsType()
export class IdArgs {
  @Field(type => ID)
  public id: string;
}

@ArgsType()
export class IdsArgs {
  @Field(type => [ID])
  public id: string[];
}
