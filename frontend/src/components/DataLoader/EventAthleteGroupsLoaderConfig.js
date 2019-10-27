// @flow
import { loader } from 'graphql.macro';

const query = loader('./../../graphql/queries/eventAthleteGroups.graphql');
const valueQuery = loader('./../../graphql/queries/athleteGroup.graphql');

const LoaderConfig = {
  dataKey: 'event',
  itemsKey: 'athleteGroups',
  valueKey: 'id',
  textKey: 'name',
  query,
  valueQuery,
  getValueQueryVariables: value => {
    if (Array.isArray(value)) {
      return {
        id: value[0]
      };
    }
    return {
      id: value
    };
  },
  valueQueryDataKey: 'athleteGroup'
};

export default LoaderConfig;
