import { loader } from 'graphql.macro';

const UpdateNextAthletesNotification = loader(
  '../graphql/subscriptions/updateNextAthletesNotification.graphql'
);

const EventAttemptsQuery = loader(
  '../graphql/queries/nextSlotAthletes.graphql'
);

export default (client, cb) =>
  client
    .subscribe({
      query: UpdateNextAthletesNotification
    })
    .subscribe({
      next({ data }) {
        client
          .query({
            query: EventAttemptsQuery,
            variables: {
              slotId: data.updateNextAthletesNotification.slotId
            }
          })
          .then(resp => cb(resp.data.slot));
      },
      error(err) {
        console.error('err', err);
      }
    });
