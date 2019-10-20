import { gql } from 'graphql.macro';

const SLOT_GROUP_CHANGED_SUBSCRIPTION = gql`
  subscription {
    slotGroupChangedNotification {
      athleteGroupIds
      date
    }
  }
`;

export default (client, cb) =>
  client
    .subscribe({
      query: SLOT_GROUP_CHANGED_SUBSCRIPTION
    })
    .subscribe({
      next(resp) {
        cb(resp.data.slotGroupChangedNotification.athleteGroupIds);
      },
      error(err) {
        console.error('err', err);
      }
    });
