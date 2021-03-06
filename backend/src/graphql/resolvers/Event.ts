import _ from "lodash";
import {
  Args,
  ArgsType,
  Field,
  FieldResolver,
  ObjectType,
  Publisher,
  PubSub,
  Resolver,
  ResolverInterface,
  Root,
  Subscription
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

@ArgsType()
class FilterBodyWeightArgs {
  @Field(type => Boolean, { nullable: true })
  public filterBodyWeight: boolean;
}

@ObjectType()
export class SlotGroupChangedNotification {
  @Field(type => Date)
  public date: Date;

  @Field(type => [String])
  public athleteGroupIds: string[];
}

@ObjectType()
export class SlotGroupChangedPayload {
  @Field(type => [String])
  public athleteGroupIds: string[];
}

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
    @PubSub("SLOP_GROUP_CHANGED")
    publish?: Publisher<{ athleteGroupIds: string[] }>,
    @Args() filterArgs?: FilterArgs,
    @Args() sortArgs?: SortArgs,
    @Args()
    { filterBodyWeight }: FilterBodyWeightArgs = { filterBodyWeight: false }
  ) {
    let eventAthletes = this.getEventAthletes(event.id);
    if (filterBodyWeight) {
      eventAthletes = eventAthletes.filter(
        athlete => athlete.bodyWeight !== null
      );
    }
    const athleteGroups = this.getEventAthleteGroups(event.id);
    let filteredAthletes = null;

    const filters = _.get(filterArgs, "filters");
    if (filters && filters.length) {
      const slotFilter = _.find(filters, { index: "slotId" });
      const resultClassFilter = _.find(filters, { index: "resultClassId" });
      const athleteGroupIdFilter = _.find(filters, { index: "athleteGroupId" });
      const athleteResolver = resultClassFilter ? new AthleteResolver() : null;

      if (athleteGroupIdFilter && publish) {
        publish({ athleteGroupIds: athleteGroupIdFilter.value });
      }

      const items = eventAthletes.map((item: any) => {
        if (slotFilter) {
          const athleteGroup = athleteGroups.find(
            ag => ag.id === item.athleteGroupId
          );
          if (athleteGroup) {
            item.slotId = athleteGroup.slotId;
          }
        }
        if (resultClassFilter) {
          item.resultClassId = athleteResolver.resultClassIdFromAthlete(item);
        }
        return item;
      });

      filteredAthletes = FilterInput.performFilter(items, filters);
    }

    let sortedAthletes = filteredAthletes || eventAthletes;
    if (sortArgs && sortArgs.sort && sortArgs.sort.length) {
      sortedAthletes = SortInput.performSort(sortedAthletes, sortArgs.sort);
    }

    return sortedAthletes;
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

  @Subscription(returns => SlotGroupChangedNotification, {
    topics: "SLOP_GROUP_CHANGED"
  })
  public slotGroupChangedNotification(
    @Root() payload: SlotGroupChangedPayload
  ): SlotGroupChangedNotification {
    return {
      athleteGroupIds: payload.athleteGroupIds,
      date: new Date()
    };
  }
}
