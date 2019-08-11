// @flow
import {loader} from "graphql.macro";
const query = loader("./../../graphql/queries/enums.graphql");

const LoaderConfig = {
  dataKey: '__type',
  itemsKey: 'enumValues',
  valueKey: 'name',
  textKey: 'description',
  query: query,

  useListQueryForValue: true,
  getQueryVariables: null,
}

export default LoaderConfig;


