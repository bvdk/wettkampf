import * as _ from "lodash";
import {FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import {Athlete} from "../models/athlete";
import {AthleteGroup} from "../models/athleteGroup";
import {Event} from "../models/event";
import {Slot} from "../models/slot";
import SlotResolver from "./Slot";

@Resolver((of) => Event)
export default class EventResolver implements ResolverInterface<Event> {

    @FieldResolver()
    public slots(@Root() event: Event) {
        return CrudAdapter.filter(Slot.collectionKey, {eventId: event.id});
    }

    @FieldResolver()
    public athletes(@Root() event: Event) {
        return CrudAdapter.filter(Athlete.collectionKey, { eventId: event.id });
    }

    @FieldResolver()
    public unsortedAthletes(@Root() event: Event) {
        const slots = this.slots(event);

        const slotResolver = new SlotResolver();

        const athleteGroupIds = _.chain(slots.map((slot) => slotResolver.athleteGroups(slot)))
            .flatten()
            .uniqBy("id")
            .map((item: AthleteGroup) => item.id)
            .value();

        const atheltes = this.athletes(event);

        return _.filter(atheltes, (athlete) => {
            return athleteGroupIds.indexOf(athlete.athleteGroupId) === -1;
        });
    }

}
