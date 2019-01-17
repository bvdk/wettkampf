import {FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import {Event} from "../models/event";
import {Slot} from "../models/slot";

@Resolver((of) => Event)
export default class EventResolver implements ResolverInterface<Event> {

    @FieldResolver()
    public slots(@Root() event: Event) {
        return CrudAdapter.filter(Slot.collectionKey, {eventId: event.id});
    }

}
