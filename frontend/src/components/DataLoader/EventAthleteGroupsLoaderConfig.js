// @flow
import {loader} from "graphql.macro";
const query = loader("./../../graphql/queries/eventAthleteGroups.graphql");
const valueQuery = loader("./../../graphql/queries/athleteGroup.graphql");

const LoaderConfig = {
  dataKey: 'event',
  itemsKey: 'athleteGroups',
  valueKey: 'id',
  textKey: 'name',
  query: query,
  valueQuery: valueQuery,
  getValueQueryVariables: (value) => {
    return {
      id: value
    }
  },
  valueQueryDataKey: 'athleteGroup',
}

export default LoaderConfig;


