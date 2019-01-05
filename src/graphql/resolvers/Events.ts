import {Context} from "graphql-cli";
import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import {Event, EventInput} from "../models/event";

@Resolver()
export default class EventsResolver {



    @Query((returns) => [Event], { description: "Get all the events" })
    public events(): Event[] {
        return CrudAdapter.getAll(Event.collectionKey);
    }

    @Query((returns) => Event, { description: "Get a event" })
    public event(
        @Arg("id") id: string,
    ): Event {
        return CrudAdapter.getItem(Event.collectionKey, id);
    }

    @Mutation()
    public createEvent(
        @Arg("data") data: EventInput,
        @Ctx() ctx: Context,
    ): Event {
        return CrudAdapter.insertItem(Event.collectionKey, data);
    }

    @Mutation()
    public updateEvent(
        @Arg("id") id: string,
        @Arg("data") data: EventInput,
        @Ctx() ctx: Context,
    ): Event {

        return CrudAdapter.updateItem(Event.collectionKey, id, data);
    }

    @Mutation()
    public deleteEvent(
        @Arg("id") id: string,
        @Ctx() ctx: Context,
    ): Event {

        return CrudAdapter.removeItem(Event.collectionKey, id);
    }

}
