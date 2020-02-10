import { gql, loader } from 'graphql.macro';
import { PublicConfigFragment } from './subscribePublicConfig';

const UpdateNextAthletesNotification = loader(
  '../graphql/subscriptions/updateNextAthletesNotification.graphql'
);

const PUBLIC_CONFIG_QUERY = gql`
  query getPublicConfig {
    getPublicConfig {
      ...PublicConfigFragment
    }
  }

  ${PublicConfigFragment}
`;

export default (client, cb) =>
  client
    .subscribe({
      query: UpdateNextAthletesNotification
    })
    .subscribe({
      next() {
        client
          .query({
            query: PUBLIC_CONFIG_QUERY,
            fetchPolicy: 'network-only'
          })
          .then(resp => cb(resp.data.getPublicConfig));
      },
      error(err) {
        console.error('err', err);
      }
    });
