// @flow
import {loader} from "graphql.macro";
const query = loader("./../../graphql/queries/slotAthleteGroups.graphql");
const valueQuery = loader("./../../graphql/queries/athleteGroup.graphql");

const LoaderConfig = {
  dataKey: 'athleteGroups',
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


