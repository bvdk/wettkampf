import  _ from "lodash";
import {FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import { Athlete } from "../models/athlete";
import {AthleteGroup} from "../models/athleteGroup";
import {Event} from "../models/event";
import {Slot} from "../models/slot";

@Resolver((of) => Slot)
export default class SlotResolver implements ResolverInterface<Slot> {

    @FieldResolver()
    public name(@Root() slot: Slot) {

        const name = _.get(slot, "name");
        if (name) {
            return name;
        }
        const eventSlots = CrudAdapter.filter(Slot.collectionKey, {eventId: slot.eventId}).map((item) => item.id) || [];

        return `Bühne ${slot.id ? eventSlots.indexOf(slot.id) + 1 : 1}`;
    }

    @FieldResolver()
    public event(@Root() slot: Slot) {
        return CrudAdapter.getItem(Event.collectionKey, slot.eventId);
    }

    @FieldResolver()
    public index(@Root() slot: Slot) {
        return slot.index || 0;
    }

    @FieldResolver()
    public athletes(@Root() slot: Slot) {
        return CrudAdapter.filter(Athlete.collectionKey, { slotId: slot.id }) || [];
    }

    @FieldResolver()
    public athleteCount(@Root() slot: Slot) {
        return _.size(this.athletes(slot));
    }

    @FieldResolver()
    public athleteGroups(@Root() slot: Slot) {
        return CrudAdapter.filter(AthleteGroup.collectionKey, { slotId: slot.id }) || [];
    }

}
