import { Table, Button, Select } from 'antd';
import React, { Component } from 'react';
import EditableCell from './editablecell';
import * as _ from 'lodash';
import './editabletablestyle.css';

const Option = Select.Option;

type Props = {
  columns: {
    title: string,
    index: string,
  }[],
  dataSource: any[],
  onChange: ?Function,
}

class EditableTable extends Component<Props> {

  static defaultProps = {
    dataSource: [],
    onChange: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.dataSourceadapter(props.dataSource),
      selectedRowKeys: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const propconst = {};
    if (!_.isEqual(this.props.columns, nextProps.columns))
      propconst.columns = nextProps.columns;
    if (!_.isEqual(this.props.columns, nextProps.columns))
      propconst.dataSource = nextProps.dataSource || [];

    if (!_.isEqual(this.props.dataSource, nextProps.dataSource)){
      propconst.dataSource = this.dataSourceadapter(nextProps.dataSource);
    }

    this.setState(propconst);
    return propconst;
  }

  onChangeTest = () => {
    if (this.props.onChange !== null) {
      this.props.onChange(
        this.state.dataSource.map(item => {
          const tmp = Object.keys(item).reduce((acc, key) => {
            if (_.findIndex(this.props.columns, { index: key }) !== -1) {
              acc[key] = item[key];
            }
            return acc;
          }, {});

          return tmp;
        }),
      );
    }
  };

  onCellChange = (key, dataIndex) => value => {
    const dataSource = [...this.state.dataSource];
    const target = dataSource.find(item => item.key === key);
    if (target) {
      target[dataIndex] = value;
      this.setState({ dataSource });
    }
    this.onChangeTest(dataSource);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  handleAdd = () => {
    const { dataSource = [] } = this.state;
    let key;
    if (dataSource.length < 1) key = 1;
    else key = Math.max.apply(null, dataSource.map(obj => obj.key)) + 1;
    const newData = {
      ...this.props.columns.reduce((acc, cur) => {
        acc[cur.index] = null;
        return acc;
      }, {}),
      key,
    };

    this.setState({
      dataSource: [...dataSource, newData],
    });
  };

  handleDelete = () => {
    const { dataSource, selectedRowKeys } = this.state;
    const newdataSource = dataSource.filter(
      el => selectedRowKeys.indexOf(el.key) === -1,
    );
    this.setState(
      {
        dataSource: newdataSource,
        selectedRowKeys: [],
      },
      () => {
        this.onChangeTest(newdataSource);
      },
    );
  };

  columnsadapter(columns) {
    return columns.map(obj => {
      const rObj = {
        title: obj.title,
        dataIndex: obj.index,
      };
      if (obj.editable) {
        rObj.render = (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, obj.index)}
          />
        );
      }
      if (obj.options) {
        rObj.render = (text, record) => (
          <Select
            className="Select"
            onChange={this.onCellChange(record.key, obj.index)}
            defaultValue={text}
          >
            {obj.options.map(d => <Option key={d.value}>{d.name}</Option>)}
          </Select>
        );
      }
      return rObj;
    });
  }

  dataSourceadapter(dataSource) {
    return dataSource.map((item, index) => ({
      ...item,
      key: index,
    }));
  }

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const columns = this.columnsadapter(this.props.columns);

    return (
      <div>
        <Button
          className="editable-add-btn mr-5"
          onClick={this.handleAdd}
          type="primary"
        >
          Neu
        </Button>
        <Button
          className="editable-delete-btn"
          onClick={this.handleDelete}
          disabled={!hasSelected}
        >
          Löschen
        </Button>
        <Table
          bordered
          rowSelection={rowSelection}
          dataSource={this.state.dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default EditableTable;
