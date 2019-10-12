import { loader } from 'graphql.macro';

const EventSlotsQuery = loader('../graphql/queries/eventSlots.graphql');

export default (client, eventId, cb) =>
  client
    .query({
      query: EventSlotsQuery,
      variables: {
        eventId
      }
    })
    .then(resp => cb(resp.data.event));
