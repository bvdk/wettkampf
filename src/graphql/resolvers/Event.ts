import * as _ from "lodash";
import {Args, FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import {Athlete} from "../models/athlete";
import {AthleteGroup} from "../models/athleteGroup";
import {Event} from "../models/event";

import {FilterInput} from "../models/filter";
import {Slot} from "../models/slot";
import FilterArgs from "./args/FilterArgs";

@Resolver((of) => Event)
export default class EventResolver implements ResolverInterface<Event> {


    public getEventAthletes(eventId: string): Athlete[] {
        return CrudAdapter.filter(Athlete.collectionKey, { eventId });
    }

    public getEventAthleteGroups(eventId: string): AthleteGroup[] {
        return CrudAdapter.filter(AthleteGroup.collectionKey, {eventId});
    }

    @FieldResolver()
    public name(@Root() event: Event) {
        return event.name || "Unbekannter Wettkampf";
    }

    @FieldResolver()
    public slots(@Root() event: Event) {
        return CrudAdapter.filter(Slot.collectionKey, {eventId: event.id});
    }

    @FieldResolver()
    public athletes(
        @Root() event: Event,
    ) {
        return this.getEventAthletes(event.id);
    }

    @FieldResolver()
    public athleteGroups(@Root() event: Event) {

        // const slots = this.slots(event);
        // const athleteGroups = _.chain(slots)
        //     .map((slot: Slot) => CrudAdapter.filter(AthleteGroup.collectionKey, { slotId: slot.id }))
        //     .flatten()
        //     .value();

        return this.getEventAthleteGroups(event.id);
    }

    @FieldResolver()
    public unsortedAthletes(
        @Root() event: Event,
        @Args() { filters }: FilterArgs,
    ) {

        const athleteGroupIds = _.chain(this.athleteGroups(event))
            .uniqBy("id")
            .map((item: AthleteGroup) => item.id)
            .value();

        const atheltes = this.athletes(event);

        const unsortedAthletes = _.filter(atheltes, (athlete) => {
            return athleteGroupIds.indexOf(athlete.athleteGroupId) === -1;
        });

        if (!filters) {
            return unsortedAthletes;
        }

        return FilterInput.performFilter(unsortedAthletes, filters);
    }

}
