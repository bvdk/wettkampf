import { flatten, get, groupBy, orderBy, size } from "lodash";
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
import { Attempt } from "../models/attempt";
import { Event } from "../models/event";
import { Slot } from "../models/slot";
import FilterArgs from "./args/FilterArgs";
import EventResolver from "./Event";

type ExtendedAthlete = Athlete & {
  done: {
    SQUAT: number;
    BENCHPRESS: number;
    DEADLIFT: number;
  };
};

function* countTo(max) {
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
    let athleteGroupIds: string[] = [];
    if (filters) {
      const athleteGroups = filters.find(f => f.index === "athleteGroupId");
      if (athleteGroups) {
        athleteGroupIds = athleteGroups.value;
      }
    }

    const eventResolver = new EventResolver();
    const event = this.event(slot);
    const disciplines = eventResolver.availableDisciplines(event);

    const slotAthletes = this.athletes(slot).filter(a => a.bodyWeight);
    const athleteGroupedAthletes = groupBy(slotAthletes, "athleteGroupId");

    const entries = Object.entries(athleteGroupedAthletes)
      .filter(entry => athleteGroupIds.includes(entry[0]))
      .map(entry => {
        let athletes = entry[1] as ExtendedAthlete[];
        athletes = athletes.map(athlete => {
          const attempts = orderBy(
            CrudAdapter.filter(Attempt.collectionKey, {
              athleteId: athlete.id
            }),
            ["discipline", "index"],
            ["asc", "asc"]
          );

          const disciplineAttempts = groupBy(attempts, "discipline");

          return {
            ...athlete,
            attempts,
            done: {
              SQUAT: disciplineAttempts.SQUAT
                ? disciplineAttempts.SQUAT.filter(d => d.done).length
                : 0,
              BENCHPRESS: disciplineAttempts.BENCHPRESS
                ? disciplineAttempts.BENCHPRESS.filter(d => d.done).length
                : 0,
              DEADLIFT: disciplineAttempts.DEADLIFT
                ? disciplineAttempts.DEADLIFT.filter(d => d.done).length
                : 0
            }
          };
        });

        return athletes;
      });
    const flattedAthletes = flatten(entries);

    const dones = {
      SQUAT: Math.min(...flattedAthletes.map(a => a.done.SQUAT)),
      BENCHPRESS: Math.min(...flattedAthletes.map(a => a.done.BENCHPRESS)),
      DEADLIFT: Math.min(...flattedAthletes.map(a => a.done.DEADLIFT))
    };

    const activeDiscipline = disciplines.find(d => dones[d] < 3);
    const attemptAmount =
      disciplines.slice(disciplines.indexOf(activeDiscipline)).length * 3;

    const multiAthletes: ExtendedAthlete[] = [];

    const iterator = countTo(attemptAmount);
    for (const value of iterator) {
      multiAthletes.push(...flattedAthletes);
    }

    return multiAthletes;
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
