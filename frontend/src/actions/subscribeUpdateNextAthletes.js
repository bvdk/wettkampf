import { loader } from 'graphql.macro';
import getNextSlotAthletes from './getNextSlotAthletes';

const UpdateNextAthletesNotification = loader(
  '../graphql/subscriptions/updateNextAthletesNotification.graphql'
);

export default (client, cb) =>
  client
    .subscribe({
      query: UpdateNextAthletesNotification
    })
    .subscribe({
      next({ data }) {
        getNextSlotAthletes(
          client,
          data.updateNextAthletesNotification.slotId,
          slot =>
            cb({
              [slot.id]: slot.nextAthletes
            })
        );
      },
      error(err) {
        console.error('err', err);
      }
    });
