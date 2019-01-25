// @flow
import React, {Component} from "react"
import _ from 'lodash';
import SelectSearch from "./SelectSearch";
import {compose, graphql} from "react-apollo";
import {withProps} from "recompose";

type Props = {
  value: ?any,
  onChange: ?Function,
  showSearch: boolean,
  renderOption: ?Function,
  options: [],
    style: any,
  mode: string,
  loaderConfig: {
    valueQueryDataKey: string,
    valueQuery: ?any,
    query: any,
    dataKey: string,
    totalKey: string,
    itemsKey: string,
    valueKey: string,
    textKey: string,
    localFilter: ?Function,
    local: boolean,
  },
  placeholder: string,
  groupByValue: string,
  groupByTitle: string,
}

class SelectAsync extends Component<Props> {

  SelectSearchWithData = null;

  constructor(props){
    super(props)

    this.state = {
      query: null
    }

    this.SelectSearchWithData = compose(
      withProps((myProps)=>({
        localFilter: _.get(props,'loaderConfig.localFilter')
      })),
      graphql(props.loaderConfig.query, {
        name: 'getQuery',
        skip: p => p.query && p.local,
        options: p =>({
            fetchPolicy: "cache-and-network",
          variables: props.loaderConfig.getQueryVariables ? props.loaderConfig.getQueryVariables(p.query) : null,
        })
      })
      )(SelectSearch);

    if (!props.loaderConfig.useListQueryForValue){
      this.SelectSearchWithData = compose(
        graphql(props.loaderConfig.valueQuery || props.loaderConfig.query, {
          name: 'getValueQuery',
          skip: p => !p.value,
          options: p =>{
            return {
              variables: props.loaderConfig.getValueQueryVariables ? props.loaderConfig.getValueQueryVariables(p.value) : null,
            }
          }
        }),
      )(this.SelectSearchWithData)
    }

  }

  componentDidMount() {

  }

  handleSearch = (query) => {

    this.setState({
      query
    });
  }

  // onChange = (value) => {
  //   if (this.isNaturalNumber(value)){
  //     this.triggerChange(Number.parseInt(value));
  //   }else {
  //     this.triggerChange(value);
  //   }
  // }

  onChange = (value) => {
    // console.log('onChange',value,option)
    if (this.selectedValue === value){
      this.triggerChange(value);
    }else {
      this.triggerChange(undefined);
    }

  }

  onSelect = (value) => {

    this.selectedValue = value;
    const onSelect = this.props.onSelect;
    if (onSelect) {
      onSelect(value);
    }

  }

  // onDeselect = () => {
  //   this.triggerChange(undefined);
  // }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  }

  render(){

      const {style, placeholder, loaderConfig, options, value, mode, showSearch, groupByValue, groupByTitle} = this.props;
    const { query } = this.state;
    const SelectSearchWithData = this.SelectSearchWithData;


    return <SelectSearchWithData
        style={style}
        showSearch={showSearch}
        mode={mode}
        value={value}
        local={loaderConfig.local}
        options={options}
        localFilter={loaderConfig.localFilter}
        dataKey={loaderConfig.dataKey}
        totalKey={loaderConfig.totalKey}
        itemsKey={loaderConfig.itemsKey}
        valueKey={loaderConfig.valueKey}
        textKey={loaderConfig.textKey}
        query={query}
        valueQueryDataKey={loaderConfig.valueQueryDataKey}
        placeholder={placeholder}
        onChange={this.onChange}
        onSelect={this.onSelect}
        handleSearch={this.handleSearch}
        groupByValue={groupByValue}
        groupByTitle={groupByTitle}
    />
  }

}

export default SelectAsync;
