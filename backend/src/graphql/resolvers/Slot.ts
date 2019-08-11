import  _ from "lodash";
import {ArgsType, Field, FieldResolver, ID, Resolver, ResolverInterface, Root} from "type-graphql";
import {CollectionKeys} from "../../database";
import {CrudAdapter} from "../../database/CrudAdapter";
import { Athlete } from "../models/athlete";
import {AthleteGroup} from "../models/athleteGroup";
import {Event} from "../models/event";
import {OfficialSlot} from "../models/officialSlot";
import {Slot} from "../models/slot";
import {Args} from "type-graphql/dist/decorators/Args";
import {Discipline} from "../models/discipline";
import {findFieldsThatChangedTypeOnInputObjectTypes} from "graphql/utilities/findBreakingChanges";



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
        const athleteGroupIds = this.athleteGroups(slot).map((item) => item.id);
        return CrudAdapter.filter(Athlete.collectionKey, (athlete) => {
            return athleteGroupIds.indexOf(athlete.athleteGroupId) !== -1;
        }) || [];
    }

    @FieldResolver()
    public athleteCount(@Root() slot: Slot) {
        return _.size(this.athletes(slot));
    }

    @FieldResolver()
    public athleteGroups(@Root() slot: Slot) {
        return CrudAdapter.filter(AthleteGroup.collectionKey, { slotId: slot.id }) || [];
    }

    @FieldResolver()
    public officialSlots(@Root() slot: Slot) {
        return CrudAdapter.filter(CollectionKeys.officialSlots, { slotId: slot.id }) || [];
    }

    @FieldResolver()
    public activeAthleteGroup(
        @Root() slot: Slot,
    ) {
        if (slot.activeAthleteGroupId) {
            return CrudAdapter.getItem(AthleteGroup.collectionKey, slot.activeAthleteGroupId);
        }
        return null;
    }

    @FieldResolver()
    public nextAthletes(
        @Root() slot: Slot,
    ) {

        if (!slot.activeDiscipline || !slot.activeAthleteGroupId){
            return [];
        }

        const athletes = this.athletes(slot);
        return _.chain(athletes)
            .orderBy([`nextAttemptsSortKeys.${slot.activeDiscipline}`, "ASC"])
            .value();

    }

}
