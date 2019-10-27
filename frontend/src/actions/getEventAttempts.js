import { gql } from 'graphql.macro';

const EventAttemptsQuery = gql`
  query eventAttempts($eventId: ID!) {
    event(id: $eventId) {
      id
      availableDisciplines
      athletes(filterBodyWeight: true) {
        id
        place
        name
        bodyWeight
        los
        total
        points
        athleteGroupId
        resultClass {
          id
          name
        }
        attempts {
          id
          index
          discipline
          weight
          valid
          done
          resign
        }
      }
    }
  }
`;

export default (client, eventId, cb) =>
  client
    .query({
      query: EventAttemptsQuery,
      variables: {
        eventId
      },
      fetchPolicy: 'network-only'
    })
    .then(resp => cb(resp.data.event));
