import {FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import {Event} from "../models/event";
import {Slot} from "../models/slot";
import Athlete from "../models/athlete";
import {AthleteGroup} from "../models/athleteGroup";

@Resolver((of) => Slot)
export default class SlotResolver implements ResolverInterface<Slot> {

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
    public athleteGroups(@Root() slot: Slot) {
        return CrudAdapter.filter(AthleteGroup.collectionKey, { slotId: slot.id }) || [];
    }

}
