import { loader } from 'graphql.macro';
import getEventAttempts from './getEventAttempts';

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
        getEventAttempts(
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
