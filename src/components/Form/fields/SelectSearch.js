// @flow
import React, {Component} from "react"

import { withNamespaces } from 'react-i18next';
import {compose} from "react-apollo";
import {Select, Spin} from "antd";
import * as _ from "lodash";
import Loader from "../../Loader";

const Option = Select.Option;
const OptGroup = Select.OptGroup;

type Props = {
  showSearch: boolean,
  options: [],
  onChange: ?Function,
  onSelect: ?Function,
  getValueQuery: {
    loading: boolean,
    refetch: ?Function,
  },
  valueQueryDataKey: string,
  getQuery: {
    loading: boolean,
    refetch: ?Function,
  },
  handleSearch: Function,
  localFilter: ?Function,
  onDeselect: ?Function,
  debounce: number,
  placeholder: string,
  local: boolean,
  dataKey: string,
  totalKey: string,
  itemsKey: string,
  valueKey: string,
  textKey: string,
  mode: string,
  groupByValue: string,
  groupByTitle: string,
}

class SelectSearch extends Component<Props> {

  static defaultProps = {
    options: [],
    debounce: 100,
    dataKey: 'data',
    totalKey: 'total',
    itemsKey: 'items',
    valueKey: 'id',
    textKey: 'name',
    valueQueryDataKey: 'data',
      mode: 'default',
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
        // this.setState({
        //   query: val
        // })
      }
    }, props.debounce);
  }

  render(){

      const {getQuery, style, onChange, t, placeholder, valueKey, textKey, local, localFilter, onDeselect, onSelect, value, getValueQuery, valueQueryDataKey, mode, showSearch, groupByValue, groupByTitle} = this.props;

    let data = [];

    if (getQuery){

      if (getQuery.error){
        console.error(getQuery.error);
      }

      if (getQuery.loading){
        data = [
          <Option disabled key={'loader'} >
            <Spin size={'small'}/>
          </Option>
        ]
      }else {
        const queryData = _.get(getQuery,this.props.dataKey);
        if (queryData){
          const items = _.get(queryData,this.props.itemsKey,[]);
          data = items.map(item => {

            const name = item[textKey] || t(item[valueKey]);

            return <Option key={item[valueKey]} name={name} value={String(item[valueKey])} item={item}>
              {name}
            </Option>
          });

        }
      }
    }

    if (data.length === 0 && getValueQuery && getValueQuery[valueQueryDataKey]){
      const item = getValueQuery[valueQueryDataKey];
      data = [
        <Option key={item[valueKey]} name={item[textKey]} value={String(item[valueKey]) || String(item[textKey])} item={item}>
          {item[textKey]}
        </Option>
      ]
    }

    if (localFilter){
      data = data.filter(localFilter)
    }

    if (groupByValue){

      const groups = _.groupBy(data, (option)=>{
        return _.get(option.props.item, groupByValue);
      });
      data = Object.keys(groups).map(groupId => (<OptGroup key={groupId} label={groupByTitle ? _.get(_.first(groups[groupId]), 'props.item.'+groupByTitle) : groupId}>{groups[groupId]}</OptGroup>));
    }

    if (getValueQuery && getValueQuery.loading && data.length === 0){
      return <Loader size={'small'}/>
    }

    return <Select
        defaultValue={value}
        showSearch={showSearch}
        mode={mode}
        allowClear
        style={{...style, minWidth: 130}}
        dropdownMatchSelectWidth={false}
        optionLabelProp={'name'}
        filterOption={local ? (input, option) => {
        return option.props.name && option.props.name.toLowerCase().indexOf(input.toLowerCase()) !== -1
      } : undefined}
        onChange={onChange}
        onSelect={onSelect}
        onDeselect={onDeselect}
        onSearch={(val)=>this.search(val)}
        placeholder={placeholder ? placeholder: 'Please select'}
    >
      {data}
    </Select>;
  }

}

export default withNamespaces()(SelectSearch);
