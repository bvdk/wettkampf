import _ from "lodash";
import {
  Args,
  FieldResolver,
  Resolver,
  ResolverInterface,
  Root
} from "type-graphql";
import { CrudAdapter } from "../../database/CrudAdapter";
import { Athlete } from "../models/athlete";
import { AthleteGroup } from "../models/athleteGroup";
import { Event } from "../models/event";

import { CollectionKeys } from "../../database";
import { Discipline } from "../models/discipline";
import { FilterInput } from "../models/filter";
import { Official } from "../models/official";
import { ResultClass } from "../models/resultClass";
import { Slot } from "../models/slot";
import { SortInput } from "../models/sort";
import FilterArgs from "./args/FilterArgs";
import SortArgs from "./args/SortArgs";
import AthleteResolver from "./Athlete";
import ResultClassResolver from "./ResultClass";
import SlotResolver from "./Slot";
import SlotsResolver from "./Slots";

@Resolver(of => Event)
export default class EventResolver implements ResolverInterface<Event> {
  public getEventAthletes(eventId: string): Athlete[] {
    return CrudAdapter.filter(Athlete.collectionKey, { eventId });
  }

  public getEventAthleteGroups(eventId: string): AthleteGroup[] {
    return CrudAdapter.filter(AthleteGroup.collectionKey, { eventId });
  }

  public getEventSlots(eventId: string): Slot[] {
    return CrudAdapter.filter(Slot.collectionKey, { eventId });
  }

  @FieldResolver()
  public name(@Root() event: Event) {
    return event.name || "Unbekannter Wettkampf";
  }

  @FieldResolver()
  public availableDisciplines(@Root() event: Event) {
    if (event.discipline === Discipline.POWERLIFTING) {
      return [Discipline.SQUAT, Discipline.BENCHPRESS, Discipline.DEADLIFT];
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
    @Args() sortArgs?: SortArgs
  ) {
    let athletes = this.getEventAthletes(event.id);
    const athleteGroups = this.getEventAthleteGroups(event.id);

    const filters = _.get(filterArgs, "filters");
    if (filters && filters.length) {
      const slotFilter = _.find(filters, { index: "slotId" });
      const resultClassFilter = _.find(filters, { index: "resultClassId" });
      const athleteResolver = new AthleteResolver();

      athletes = FilterInput.performFilter(
        athletes.map(item => {
          const tmp: any = {
            ...item
          };
          if (slotFilter) {
            tmp.slotId = _.chain(athleteGroups)
              .find({ id: item.athleteGroupId })
              .get("slotId")
              .value();
          }
          if (resultClassFilter) {
            tmp.resultClassId = athleteResolver.resultClassIdFromAthlete(item);
          }
          return tmp;
        }),
        filters
      );
    }

    if (sortArgs && sortArgs.sort && sortArgs.sort.length) {
      athletes = SortInput.performSort(athletes, sortArgs.sort);
    }

    return athletes;
  }

  @FieldResolver()
  public results(
    @Root() event: Event,
    @Args() filterArgs?: FilterArgs,
    @Args() sortArgs?: SortArgs
  ) {
    let result = [];
    let resultClassIds = [];

    const resultClassId = _.chain(filterArgs.filters)
      .find({ index: "resultClassId" })
      .get("value")
      .value();

    if (resultClassId) {
      resultClassIds.push(resultClassId);
    }

    const slotId: string = _.chain(filterArgs.filters)
      .find({ index: "slotId" })
      .get("value")
      .first()
      .value();

    if (!resultClassIds.length && slotId) {
      const slotsResolver = new SlotsResolver();
      const slotResolver = new SlotResolver();
      const athleteResolver = new AthleteResolver();
      const slot = slotsResolver.slot({ id: slotId });
      const slotAthletes = slotResolver.athletes(slot);
      const slotGroups = _.groupBy(slotAthletes, athlete =>
        athleteResolver.resultClassIdFromAthlete(athlete)
      );
      resultClassIds = Object.keys(slotGroups);
    }

    if (resultClassIds.length) {
      const resultClassResolver = new ResultClassResolver();
      result = _.chain(resultClassIds)
        .map((id: string) => resultClassResolver.athletes({ id }))
        .flatten()
        .value();
    } else {
      result = this.athletes(event);
    }

    result = result.filter(athlete => athlete.bodyWeight);

    if (sortArgs && sortArgs.sort && sortArgs.sort.length) {
      result = SortInput.performSort(result, sortArgs.sort);
    }
    return result;
  }

  @FieldResolver()
  public officials(@Root() event: Event): Official[] {
    return CrudAdapter.filter(CollectionKeys.officials, {
      eventId: event.id
    });
  }

  @FieldResolver()
  public athleteGroups(@Root() event: Event) {
    return this.getEventAthleteGroups(event.id);
  }

  @FieldResolver()
  public unsortedAthletes(
    @Root() event: Event,
    @Args() { filters }: FilterArgs
  ) {
    const athleteGroupIds = _.chain(this.athleteGroups(event))
      .uniqBy("id")
      .map((item: AthleteGroup) => item.id)
      .value();

    const athletes = this.athletes(event);

    const unsortedAthletes = _.filter(athletes, athlete => {
      return athleteGroupIds.indexOf(athlete.athleteGroupId) === -1;
    });

    if (!filters) {
      return unsortedAthletes;
    }

    return FilterInput.performFilter(unsortedAthletes, filters);
  }

  @FieldResolver()
  public resultClasses(@Root() event: Event): ResultClass[] {
    const athleteResolver = new AthleteResolver();

    const groups = _.chain(this.athletes(event))
      .groupBy(athlete => athleteResolver.resultClassIdFromAthlete(athlete))
      .value();

    return Object.keys(groups).map(groupId => {
      const athlete = _.first(groups[groupId]);
      return athleteResolver.resultClass(athlete);
    });
  }
}
