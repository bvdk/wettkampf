import { gql } from 'graphql.macro';

const PUBLIC_CONFIG_SUBSCRIPTION = gql`
  subscription subscribePublicConfig {
    subscribePublicConfig {
      eventId
    }
  }
`;

export default (client, cb) =>
  client
    .subscribe({
      query: PUBLIC_CONFIG_SUBSCRIPTION
    })
    .subscribe({
      next(resp) {
        cb(resp.data.subscribePublicConfig);
      },
      error(err) {
        console.error('err', err);
      }
    });
