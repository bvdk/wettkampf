import _ from "lodash";
import {Args, FieldResolver, Resolver, ResolverInterface, Root} from "type-graphql";
import {CrudAdapter} from "../../database/CrudAdapter";
import {Athlete} from "../models/athlete";
import {AthleteGroup} from "../models/athleteGroup";
import {Event} from "../models/event";

import {CollectionKeys} from "../../database";
import {Discipline} from "../models/discipline";
import {FilterInput} from "../models/filter";
import {Official} from "../models/official";
import {ResultClass} from "../models/resultClass";
import {Slot} from "../models/slot";
import {SortInput} from "../models/sort";
import AgeClassesResolver from "./AgeClasses";
import FilterArgs from "./args/FilterArgs";
import SortArgs from "./args/SortArgs";
import WeightClassesResolver from "./WeightClasses";

@Resolver((of) => Event)
export default class EventResolver implements ResolverInterface<Event> {


    public getEventAthletes(eventId: string): Athlete[] {
        return CrudAdapter.filter(Athlete.collectionKey, { eventId });
    }

    public getEventAthleteGroups(eventId: string): AthleteGroup[] {
        return CrudAdapter.filter(AthleteGroup.collectionKey, {eventId});
    }

    public getEventSlots(eventId: string): Slot[] {
        return CrudAdapter.filter(Slot.collectionKey, {eventId});
    }

    @FieldResolver()
    public name(@Root() event: Event) {
        return event.name || "Unbekannter Wettkampf";
    }

    @FieldResolver()
    public availableDisciplines(@Root() event: Event) {
        if (event.discipline === Discipline.POWERLIFTING) {
            return [
                Discipline.SQUAT,
                Discipline.BENCHPRESS,
                Discipline.DEADLIFT,
            ];
        }
        if (event.discipline) {
            return [event.discipline];
        }
        return [];
    }

    @FieldResolver()
    public slots(@Root() event: Event) {
        return this.getEventSlots(event.id);
    }

    @FieldResolver()
    public athletes(
        @Root() event: Event,
        @Args() filterArgs?: FilterArgs,
        @Args() sortArgs?: SortArgs,
    ) {

        let athletes = this.getEventAthletes(event.id);
        const athleteGroups = this.getEventAthleteGroups(event.id);

        const filters = _.get(filterArgs, "filters");
        if (filters) {
            athletes = FilterInput.performFilter(athletes.map((item) => {

                return {
                    ...item,
                    slotId: _.chain(athleteGroups).find({id: item.athleteGroupId}).get("slotId").value(),
                };
            }), filters);

        }

        if (sortArgs && sortArgs.sort && sortArgs.sort.length) {
            athletes = SortInput.performSort(athletes, sortArgs.sort);
        }

        return athletes;
    }


    @FieldResolver()
    public officials(
        @Root() event: Event,
    ): Official[] {
        return CrudAdapter.filter(CollectionKeys.officials, {
            eventId: event.id,
        });
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


    @FieldResolver()
    public resultClasses(
        @Root() event: Event,
    ): ResultClass[] {

        const groups = _.chain(this.athletes(event))
            .groupBy((athlete) => {
                const keyComponents = [
                    "gender",
                    "weightClassId",
                    "ageClassId",
                    "raw",
                ];

                return keyComponents
                    .map((key) => athlete[key])
                    .filter((item) => item)
                    .join("-");
            })
            .value();

        return Object.keys(groups).map((groupId) => {
            const athlete = _.first(groups[groupId]);
            const resultClass: ResultClass = {
                ageClassId: athlete.ageClassId,
                gender: athlete.gender,
                id: groupId,
                raw: athlete.raw,
                weightClassId: athlete.weightClassId,
            };
            return resultClass;
        });
    }

}
