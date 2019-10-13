import { get, groupBy, orderBy, size } from "lodash";
import {
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
  public event(@Root() slot: Slot) {
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
  public nextAthletes(@Root() slot: Slot) {
    // At first every Athlete does 3 squats, then 3 benchpresses and then 3 deadlifts
    const disciplines = ["SQUAT", "BENCHPRESS", "DEADLIFT"];

    const athleteGroupedAthletes = groupBy(
      this.athletes(slot).filter(athlete => athlete.bodyWeight !== null),
      "athleteGroupId"
    );

    const entries = Object.entries(athleteGroupedAthletes).map(entry => {
      let athletes = entry[1] as ExtendedAthlete[];
      athletes = athletes
        .map(athlete => {
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
        })
        .sort((a, b) => {
          const nextAAttempt = a.attempts.find(attempt => !attempt.done);
          const nextBAttempt = b.attempts.find(attempt => !attempt.done);

          if (nextAAttempt && nextBAttempt) {
            const diff = nextBAttempt.weight - nextAAttempt.weight;

            if (diff === 0) {
              return b.los - a.los;
            }
            return diff;
          }

          return 0;
        })
        .reverse();

      const dones = {
        SQUAT: Math.min(...athletes.map(a => a.done.SQUAT)),
        BENCHPRESS: Math.min(...athletes.map(a => a.done.BENCHPRESS)),
        DEADLIFT: Math.min(...athletes.map(a => a.done.DEADLIFT))
      };

      const activeDiscipline = disciplines.find(d => dones[d] < 3);
      const attemptAmount =
        disciplines.slice(disciplines.indexOf(activeDiscipline)).length * 3;

      const cumulatedAthletes: ExtendedAthlete[] = [];

      const iterator = countTo(attemptAmount);
      for (const value of iterator) {
        cumulatedAthletes.push(...athletes);
      }

      athletes.forEach(athlete => {
        const doneAttempts = Object.entries(athlete.done).reduce(
          (acc: number, val: [string, number]) => {
            acc += val[1];
            return acc;
          },
          0
        );

        const doneIterator = countTo(doneAttempts);
        for (const value of doneIterator) {
          cumulatedAthletes.splice(cumulatedAthletes.indexOf(athlete), 1);
        }
      });
      return cumulatedAthletes;
    });

    console.log(entries);
    return entries.flat().slice(0, 50);
  }

  @Subscription(returns => UpdateNotification, {
    topics: "UPDATE_NEXT_ATHLETE_NOTIFICATIONS"
  })
  public updateNextAthletesNotification(
    @Root() payload: UpdateNotificationPayload
  ): UpdateNotification {
    console.log(payload);
    return {
      slotId: payload.slotId,
      date: new Date()
    };
  }
}
