import { gql } from 'graphql.macro';

const EventSlotsQuery = gql`
  query eventSlots($eventId: ID!) {
    event(id: $eventId) {
      id
      slots {
        id
      }
    }
  }
`;

export default (client, eventId, cb) =>
  client
    .query({
      query: EventSlotsQuery,
      variables: {
        eventId
      }
    })
    .then(resp => cb(resp.data.event));
