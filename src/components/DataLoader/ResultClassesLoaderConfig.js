// @flow
import {loader} from "graphql.macro";
const query = loader("./../../graphql/queries/eventResultClasses.graphql");

const LoaderConfig = {
  dataKey: 'event.resultClasses',
  itemsKey: null,
  valueKey: 'id',
  textKey: 'name',
  query: query,

  useListQueryForValue: true,
  getQueryVariables: null,
}

export default LoaderConfig;


