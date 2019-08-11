// @flow
import {loader} from "graphql.macro";
const query = loader("./../../graphql/queries/ageClasses.graphql");

const LoaderConfig = {
  dataKey: 'ageClasses',
  itemsKey: null,
  valueKey: 'id',
  textKey: 'name',
  query: query,

  useListQueryForValue: true,
  getQueryVariables: null,
}

export default LoaderConfig;


