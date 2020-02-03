import { flatten, get, groupBy, size } from "lodash";
import {
  Args,
  Field,
  FieldResolver,
  ObjectType,
  Resolver,
  ResolverInterface,
  Root,
  Subscription
} from "type-graphql";
import { CollectionKeys } from "../../database";
import { CrudAdapter } from "../../database/CrudAdapter";
import { Athlete } from "../models/athlete";
import { AthleteGroup } from "../models/athleteGroup";
import { Event } from "../models/event";
import { FilterInput } from "../models/filter";
import { Slot } from "../models/slot";
import FilterArgs from "./args/FilterArgs";

type ExtendedAthlete = Athlete & {
  done: {
    SQUAT: number;
    BENCHPRESS: number;
    DEADLIFT: number;
  };
};

export function* countTo(max) {
  let index = 0;
  while (index < max) {
    yield index++;
  }
}

@ObjectType()
export class UpdateNotification {
  @Field(type => Date)
  public date: Date;

  @Field(type => String)
  public slotId: string;
}

@ObjectType()
export class UpdateNotificationPayload {
  @Field(type => String)
  public slotId: string;
}

const calcNextAthletes = (
  slot: Slot,
  event: Event,
  slotAthletes: Athlete[],
  filters: FilterInput[]
) => {
  let athleteGroupIds: string[] = [];
  if (filters) {
    const athleteGroups = filters.find(f => f.index === "athleteGroupId");
    if (athleteGroups) {
      athleteGroupIds = athleteGroups.value;
    }
  }

  const filteredSlotAthletes = slotAthletes.filter(a => a.bodyWeight);
  const athleteGroupedAthletes = groupBy(
    filteredSlotAthletes,
    "athleteGroupId"
  );

  const entries = Object.entries(athleteGroupedAthletes)
    .filter(entry => athleteGroupIds.includes(entry[0]))
    .map(entry => {
      return entry[1] as ExtendedAthlete[];
    });
  return flatten(entries);
};

@Resolver(of => Slot)
export default class SlotResolver implements ResolverInterface<Slot> {
  @FieldResolver()
  public name(@Root() slot: Slot) {
    const name = get(slot, "name");
    if (name) {
      return name;
    }
    const eventSlots =
      CrudAdapter.filter(Slot.collectionKey, { eventId: slot.eventId }).map(
        item => item.id
      ) || [];

    return `Bühne ${slot.id ? eventSlots.indexOf(slot.id) + 1 : 1}`;
  }

  @FieldResolver()
  public event(@Root() slot: Slot): Event {
    return CrudAdapter.getItem(Event.collectionKey, slot.eventId);
  }

  @FieldResolver()
  public index(@Root() slot: Slot) {
    return slot.index || 0;
  }

  @FieldResolver()
  public athletes(@Root() slot: Slot): Athlete[] {
    const athleteGroupIds = this.athleteGroups(slot).map(item => item.id);
    return (
      CrudAdapter.filter(Athlete.collectionKey, athlete => {
        return athleteGroupIds.indexOf(athlete.athleteGroupId) !== -1;
      }) || []
    );
  }

  @FieldResolver()
  public athleteCount(@Root() slot: Slot) {
    return size(this.athletes(slot));
  }

  @FieldResolver()
  public athleteGroups(@Root() slot: Slot) {
    return (
      CrudAdapter.filter(AthleteGroup.collectionKey, { slotId: slot.id }) || []
    );
  }

  @FieldResolver()
  public officialSlots(@Root() slot: Slot) {
    return (
      CrudAdapter.filter(CollectionKeys.officialSlots, { slotId: slot.id }) ||
      []
    );
  }

  @FieldResolver()
  public activeAthleteGroup(@Root() slot: Slot) {
    if (slot.activeAthleteGroupId) {
      return CrudAdapter.getItem(
        AthleteGroup.collectionKey,
        slot.activeAthleteGroupId
      );
    }
    return null;
  }

  @FieldResolver()
  public nextAthletes(@Root() slot: Slot, @Args() { filters }: FilterArgs) {
    return calcNextAthletes(
      slot,
      this.event(slot),
      this.athletes(slot),
      filters
    );
  }

  @Subscription(returns => UpdateNotification, {
    topics: "UPDATE_NEXT_ATHLETE_NOTIFICATIONS"
  })
  public updateNextAthletesNotification(
    @Root() payload: UpdateNotificationPayload
  ): UpdateNotification {
    return {
      ...payload,
      date: new Date()
    };
  }
}
