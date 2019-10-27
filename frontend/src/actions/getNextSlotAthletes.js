import { loader } from 'graphql.macro';

const NextSlotAthletesQuery = loader(
  '../graphql/queries/nextSlotAthletes.graphql'
);

export default (client, slotId, athleteGroups, cb) => {
  const filters = [];
  filters.push({
    value: athleteGroups,
    index: 'athleteGroupId'
  });

  return client
    .query({
      query: NextSlotAthletesQuery,
      variables: {
        slotId,
        filters
      },
      fetchPolicy: 'network-only'
    })
    .then(resp => cb(resp.data.slot));
};
