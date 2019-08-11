// @flow
import React, { Component } from 'react';
import _ from 'lodash'
import {Button, Table} from "antd";
import type {DataLoaderType} from "../../DataLoader/DataLoaderType";
import SelectAsync from "./SelectAsync";
import Sizes from "../../../styles/sizes";
import {toastError} from "../../../utils/toast";

type Props = {
  dataSource?: any[],
  value: string[],
  onChange?: Function,
  loaderConfig?: DataLoaderType,
  options?: { //todo
    value: string,
    name: string,
  }[],
  translateTitle?: boolean,
  columns: [],
  addMutation?: Function,
  translateAddMutationOptions?: Function,
  removeMutation?: Function,
  translateRemoveMutationOptions?: Function,
};

type State = {
  loading: boolean
}

class TablePicker extends Component<Props, State> {

  state = {
    loading: false
  }

  static defaultProps = {
    value: [],
    translateTitle: true,
    columns: [{
      dataIndex: 'name',
      key: 'name',
      title: 'Name'
    }]
  }

  setLoading = (loading) => {
      return new Promise((resolve) => {
          this.setState({
              loading
          }, resolve)
      })
  }

  _handleRemove = (item) => {

    const { onChange, value, removeMutation, translateRemoveMutationOptions } = this.props;

    if (removeMutation){
      const options = translateRemoveMutationOptions ? translateRemoveMutationOptions(item) : value;
      this.setLoading(true)
        .then(() => removeMutation(options))
        .catch(toastError)
        .finally(()=>{
          this.setLoading(false)
        })
      ;
    }

    if (onChange){
      const removeIndex = value.indexOf(item);
      if (removeIndex > -1){
        const newValue =_.clone(value);
        newValue.splice(removeIndex, 1);
        onChange(newValue);
      }
    }

  }

  _handleAdd = (item) => {

    const { addMutation, translateAddMutationOptions,onChange, value } = this.props;

    if (addMutation){
      const options = translateAddMutationOptions ? translateAddMutationOptions(item) : value;
      this.setLoading(true)
        .then(() => addMutation(options))
        .catch(toastError)
        .finally(()=>{
          this.setLoading(false)
        })
      ;
    }

    if (onChange){
      onChange([...value, item]);
    }
  }

  render() {
    const { columns, value, loaderConfig, dataSource } = this.props;

    const renderColumns = [
      ...columns,
      {
        dataIndex: 'action',
        key: 'action',
        render: (text, item) => <Button onClick={() => this._handleRemove(item.id)} size={'small'} shape={'circle'} icon={'remove'} type={'danger'}/>
      }
    ]

    let newDataSource = dataSource || value.map(item => ({id: item}));

    return <div>
      <SelectAsync style={{width: "100%", marginBottom: Sizes.grid}} onSelect={this._handleAdd} showSearch={true} loaderConfig={loaderConfig}/>
      <Table
        loading={this.state.loading}
        rowKey={"id"}
        size={'small'}
        pagination={false}
        columns={renderColumns}
        dataSource={newDataSource}
      />

    </div>;
  }
}


export default TablePicker;
