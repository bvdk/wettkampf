import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PublicConfig {
  @Field(type => String)
  private eventId: string;

  public getEventId(): string {
    return this.eventId;
  }

  public setEventId(eventId: string) {
    this.eventId = eventId;
  }
}
