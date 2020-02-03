import { loader } from 'graphql.macro';
import getNextSlotAthletes from './getNextSlotAthletes';

const UpdateNextAthletesNotification = loader(
  '../graphql/subscriptions/updateNextAthletesNotification.graphql'
);

const availableDisciplines = ['SQUAT', 'BENCHPRESS', 'DEADLIFT'];

export default (client, athleteGroups, cb) =>
  client
    .subscribe({
      query: UpdateNextAthletesNotification
    })
    .subscribe({
      next({ data }) {
        getNextSlotAthletes(
          client,
          data.updateNextAthletesNotification.slotId,
          athleteGroups,
          slot =>
            cb({
              [slot.id]: slot.nextAthletes.map(item => ({
                ...item,
                attempts: availableDisciplines.flatMap(discipline =>
                  item.attempts.filter(a => a.discipline === discipline)
                )
              }))
            })
        );
      },
      error(err) {
        console.error('err', err);
      }
    });
