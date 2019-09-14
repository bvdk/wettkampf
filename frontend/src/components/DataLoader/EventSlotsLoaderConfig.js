// @flow
import { loader } from 'graphql.macro';

const query = loader('./../../graphql/queries/eventSlots.graphql');
const slotQuery = loader('./../../graphql/queries/slot.graphql');

const LoaderConfig = {
  dataKey: 'event',
  itemsKey: 'slots',
  valueKey: 'id',
  textKey: 'name',
  query,
  valueQuery: slotQuery,
  getValueQueryVariables: value => {
    return {
      id: value
    };
  },
  valueQueryDataKey: 'slot'
};

export default LoaderConfig;
