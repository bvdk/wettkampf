import _ from "lodash";
import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { CollectionKeys } from "../../database";
import { CrudAdapter } from "../../database/CrudAdapter";
import { Athlete } from "../models/athlete";
import { AthleteGroup } from "../models/athleteGroup";
import { Attempt } from "../models/attempt";
import { Event } from "../models/event";
import { Slot } from "../models/slot";

function* countTo(max) {
  let index = 0;
  while (index < max) {
    yield index++;
  }
}

@Resolver(of => Slot)
export default class SlotResolver implements ResolverInterface<Slot> {
  @FieldResolver()
  public name(@Root() slot: Slot) {
    const name = _.get(slot, "name");
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
  public athletes(@Root() slot: Slot) {
    const athleteGroupIds = this.athleteGroups(slot).map(item => item.id);
    return (
      CrudAdapter.filter(Athlete.collectionKey, athlete => {
        return athleteGroupIds.indexOf(athlete.athleteGroupId) !== -1;
      }) || []
    );
  }

  @FieldResolver()
  public athleteCount(@Root() slot: Slot) {
    return _.size(this.athletes(slot));
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
    if (!slot.activeDiscipline || !slot.activeAthleteGroupId) {
      return [];
    }

    // At first every Athlete does 3 squats, then 3 benchpresses and then 3 deadlifts
    const disciplines = ["SQUAT", "BENCHPRESS", "DEADLIFT"];

    const athletes = _.chain(
      this.athletes(slot).filter(athlete => athlete.bodyWeight !== null)
    )
      .orderBy([`nextAttemptsSortKeys.${slot.activeDiscipline}`, "ASC"])
      .value()
      .map(athlete => {
        const attempts = _.orderBy(
          CrudAdapter.filter(Attempt.collectionKey, { athleteId: athlete.id }),
          ["discipline", "asc"],
          ["index", "asc"]
        );

        const disciplineAttempts = _.groupBy(attempts, "discipline");

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
          const diff =
            nextBAttempt.weight > nextAAttempt.weight
              ? nextBAttempt.weight - nextAAttempt.weight
              : nextAAttempt.weight - nextBAttempt.weight;

          if (diff === 0) {
            return b.los - a.los;
          }
          return diff;
        }

        return 0;
      });

    const dones = {
      SQUAT: Math.min(...athletes.map(a => a.done.SQUAT)),
      BENCHPRESS: Math.min(...athletes.map(a => a.done.BENCHPRESS)),
      DEADLIFT: Math.min(...athletes.map(a => a.done.DEADLIFT))
    };

    const activeDiscipline = disciplines.find(d => dones[d] < 3);
    // const nextDiscipline =
    //   disciplines[disciplines.indexOf(activeDiscipline) + 1];

    const attemptAmount =
      disciplines.slice(disciplines.indexOf(activeDiscipline)).length * 3;

    const iterator = countTo(attemptAmount);

    const cumulatedAthletes = [];
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

    return cumulatedAthletes.slice(0, 50);
  }
}
