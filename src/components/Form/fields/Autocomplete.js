// @flow
import React, {Component} from "react"

import {compose, graphql} from "react-apollo/index";
import AutocompleteSearch from "./AutocompleteSearch";

type Props = {
  showSearch: boolean,
  value: ?any,
  onChange: ?Function,
  selectOnly: boolean,
  renderOption: ?Function,
  loaderConfig: {
    query: any,
    dataKey: string,
    totalKey: string,
    itemsKey: string,
    valueKey: string,
    textKey: string,
    localFilter: ?Function,
    local: boolean
  },
  placeholder: string
}

class Autocomplete extends Component<Props> {

  AutocompleteSearchWithData = null;

  constructor(props){
    super(props)

    this.state = {
      query: null
    }

    this.AutocompleteSearchWithData = graphql(props.loaderConfig.query, {
      name: 'getQuery',
      options: p =>({
				skip: p.query === null && !p.local,
				variables: props.loaderConfig.getQueryVariables ? props.loaderConfig.getQueryVariables(p.query) : null,
			})
    })(AutocompleteSearch);

  }

  componentDidMount() {

  }

  handleSearch = (query) => {

    this.setState({
      query
    });
  }

  isNaturalNumber(n) {
    n = n.toString(); // force the value incase it is not
    let n1 = Math.abs(n),
      n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
  }

  onChange = (value) => {
    if (this.isNaturalNumber(value)){
      this.triggerChange(Number.parseInt(value, 10));
    }else {
      this.triggerChange(value);
    }
  }

  onSelect = (value) => {
    console.log(value);
		this.triggerChange(value);
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  }

  render(){

    const {  placeholder, loaderConfig, selectOnly, showSearch } = this.props;
    const { query } = this.state;
    const AutocompleteSearchWithData = this.AutocompleteSearchWithData;

    return <AutocompleteSearchWithData
      showSearch={showSearch}
      local={loaderConfig.local}
      localFilter={loaderConfig.localFilter}
      dataKey={loaderConfig.dataKey}
      totalKey={loaderConfig.totalKey}
      itemsKey={loaderConfig.itemsKey}
      valueKey={loaderConfig.valueKey}
      textKey={loaderConfig.textKey}
      query={query}
      placeholder={placeholder}
      onChange={!selectOnly ? this.onChange : undefined}
      onSelect={selectOnly ? this.onSelect : undefined}
      handleSearch={this.handleSearch}/>
  }

}

export default compose(

)(Autocomplete);
