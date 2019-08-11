// @flow
import React, {Component} from "react"

import {compose} from "react-apollo";
import {AutoComplete, Spin} from "antd";
import * as _ from "lodash";

const Option = AutoComplete.Option;

type Props = {
  showSearch: boolean,
  onSelect: ?Function,
  onChange: ?Function,
  getQuery: {
    loading: boolean,
    refetch: ?Function,
  },
  handleSearch: Function,
  localFilter: ?Function,
  debounce: number,
  placeholder: string,
  local: boolean,
  dataKey: string,
  totalKey: string,
  itemsKey: string,
  valueKey: string,
  textKey: string,
}

class AutocompleteSearch extends Component<Props> {

  static defaultProps = {
    debounce: 100,
    dataKey: 'data',
    totalKey: 'total',
    itemsKey: 'items',
    valueKey: 'id',
    textKey: 'name',
  }

  constructor(props){
    super(props)

    this.state = {
      query: null
    }

    this.search = _.debounce(val => {
      if (!props.local){
				this.props.handleSearch(val)
      }else {
        this.setState({
          query: val
        })
      }
    }, props.debounce);
  }

  render(){

    const { getQuery, onSelect, onChange, t, placeholder, valueKey, textKey, showSearch} = this.props;

    let data = [];

    if (getQuery){
      if (getQuery.loading){
        data = [
          <Option disabled key={'loader'} >
            <Spin size={'small'}/>
          </Option>
        ]
      }else {
        const queryData = _.get(getQuery,this.props.dataKey);
        if (queryData && queryData[this.props.totalKey] > 0){
          data = queryData[this.props.itemsKey];
        }
        data = data.map(item => (
          <Option key={item[valueKey]} name={item[textKey]} value={String(item[valueKey])} item={item}>
            {item[textKey]}
          </Option>
        ));
      }
    }

		if (this.props.localFilter){
			data = data.filter(this.props.localFilter)
		}
		if (this.state.query){
			data = data.filter((item)=>{
				return item.props.name && item.props.name.toLowerCase().indexOf(this.state.query.toLowerCase()) > -1
			})
    }

    return <AutoComplete
      showSearch={showSearch}
      style={{width: '100%'}}
      dataSource={data}
      optionLabelProp={'name'}
      onSelect={onSelect}
      onChange={onChange}
      onSearch={(val)=>this.search(val)}
      placeholder={placeholder}
    />;
  }

}

export default AutocompleteSearch;
