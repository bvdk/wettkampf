// @flow
import query from "./../../graphql/queries/enums.graphql"

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


