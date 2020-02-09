import { gql } from 'graphql.macro';

export const PublicConfigFragment = gql`
  fragment PublicConfigFragment on PublicConfig {
    event {
      id
      availableDisciplines
    }
    slot {
      id
    }
    athleteGroups {
      id
    }
    nextAthletes {
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
`;

const PUBLIC_CONFIG_SUBSCRIPTION = gql`
  subscription subscribePublicConfig {
    subscribePublicConfig {
      ...PublicConfigFragment
    }
  }

  ${PublicConfigFragment}
`;

export default (client, cb) => {
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
};
