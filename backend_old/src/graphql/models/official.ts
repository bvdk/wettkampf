import { Field, ID, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class Official {
  @Field(type => ID)
  public id: string;

  @Field({ nullable: true })
  public importId?: string;

  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field()
  public name: string;

  @Field({ nullable: true })
  public club?: string;

  @Field({ nullable: true })
  public position?: string;

  @Field({ nullable: true })
  public location?: string;

  @Field({ nullable: true })
  public license?: string;
}

@InputType()
export class OfficialInput {
  @Field({ nullable: true })
  public firstName?: string;

  @Field({ nullable: true })
  public lastName?: string;

  @Field({ nullable: true })
  public club?: string;

  @Field({ nullable: true })
  public position?: string;

  @Field({ nullable: true })
  public location?: string;

  @Field({ nullable: true })
  public license?: string;
}
