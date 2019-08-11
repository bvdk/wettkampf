
export type DataLoaderType = {
  valueQueryDataKey?: string,
  valueQuery?: any,
  getQueryVariables?: Function,
  getValueQueryVariables?: Function,
  query: any,
  dataReducer?: Function,
  dataKey: string,
  totalKey: string,
  itemsKey: string,
  valueKey: string,
  textKey: string,
  localFilter?: Function,
  local?: boolean,
}
