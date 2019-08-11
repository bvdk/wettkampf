// @flow
import {loader} from "graphql.macro";
const query = loader("./../../graphql/queries/eventOfficials.graphql");
const valueQuery = loader("./../../graphql/queries/officialName.graphql");


const LoaderConfig = {
  dataKey: 'event',
  itemsKey: 'officials',
  valueKey: 'id',
  textKey: 'name',
  query: query,
  valueQuery: valueQuery,
  getValueQueryVariables: (value) => {
    return {
      id: value
    }
  },
  valueQueryDataKey: 'official',
}

export default LoaderConfig;


