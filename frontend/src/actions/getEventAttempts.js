import { loader } from 'graphql.macro';

const EventAttemptsQuery = loader(
  '../graphql/queries/nextSlotAthletes.graphql'
);

export default (client, slotId, cb) =>
  client
    .query({
      query: EventAttemptsQuery,
      variables: {
        slotId
      },
      fetchPolicy: 'network-only'
    })
    .then(resp => cb(resp.data.slot));
