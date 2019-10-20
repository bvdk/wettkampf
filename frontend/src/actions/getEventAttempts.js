import { loader } from 'graphql.macro';

const EventAttemptsQuery = loader('../graphql/queries/eventAttempts.graphql');

export default (client, eventId, discipline, cb) =>
  client
    .query({
      query: EventAttemptsQuery,
      variables: {
        eventId,
        discipline,
        filters: [],
        sort: []
      },
      fetchPolicy: 'network-only'
    })
    .then(resp => cb(resp.data.event));
