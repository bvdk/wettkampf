import { loader } from 'graphql.macro';

const NextSlotAthletesQuery = loader(
  '../graphql/queries/nextSlotAthletes.graphql'
);

export default (client, slotId, cb) =>
  client
    .query({
      query: NextSlotAthletesQuery,
      variables: {
        slotId
      },
      fetchPolicy: 'network-only'
    })
    .then(resp => cb(resp.data.slot));
