// @flow
import {loader} from "graphql.macro";
const query = loader("./../../graphql/queries/weightClasses.graphql");

const LoaderConfig = {
  dataKey: 'weightClasses',
  itemsKey: null,
  valueKey: 'id',
  textKey: 'name',
  query: query,

  useListQueryForValue: true,
  getQueryVariables: null,
}

export default LoaderConfig;


