import { ArgsType, Field, ID } from "type-graphql";

@ArgsType()
export default class IdArgs {
  @Field(type => ID)
  public id: string;
}
