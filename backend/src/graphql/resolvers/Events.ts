import { Context } from "graphql-yoga/dist/types";
import { Arg, Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CrudAdapter } from "../../database/CrudAdapter";
import { Event, EventInput } from "../models/event";
import IdArgs from "./args/IdArgs";
import SlotsResolver from "./Slots";

@Resolver()
export default class EventsResolver {
  private nextCache: Event | null = null;
  private nextCacheUpdate: number | null = null;

  @Query(returns => [Event], { description: "Get all the events" })
  public events(): Event[] {
    return CrudAdapter.getAll(Event.collectionKey);
  }

  @Query(returns => Event, { description: "Get a event" })
  public event(@Args() { id }: IdArgs): Event {
    const now = new Date().getTime();
    if (
      !this.nextCacheUpdate ||
      (this.nextCacheUpdate && now - this.nextCacheUpdate > 1000)
    ) {
      this.nextCache = CrudAdapter.getItem(Event.collectionKey, id);
      this.nextCacheUpdate = new Date().getTime();
    }
    return this.nextCache;
  }

  @Mutation()
  public createEvent(
    @Arg("data") data: EventInput,
    @Ctx() ctx: Context
  ): Event {
    const event = CrudAdapter.insertItem(Event.collectionKey, data);
    const slotResolver = new SlotsResolver();
    slotResolver.createSlot(
      {
        data: {
          name: "Bühne 1"
        },
        eventId: event.id
      },
      ctx
    );
    return event;
  }

  @Mutation()
  public updateEvent(
    @Args() { id }: IdArgs,
    @Arg("data") data: EventInput,
    @Ctx() ctx: Context
  ): Event {
    return CrudAdapter.updateItem(Event.collectionKey, id, data);
  }

  @Mutation()
  public deleteEvent(@Args() { id }: IdArgs, @Ctx() ctx: Context): Event {
    return CrudAdapter.removeItem(Event.collectionKey, id);
  }
}
