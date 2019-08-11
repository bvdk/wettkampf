// @flow
import React, {Component} from 'react';
import _ from 'lodash';
import {Table} from "antd";


type Props = {
  officialSlots: any[],
  selectedRowKeys: string[],
  onSelectionChange?: Function
};

type State = {
  selectedRowKeys: string[],
}

class OfficialSlotsTable extends Component<Props, State> {

  onSelectChange = (selectedRowKeys) => {

    this.props.onSelectionChange(selectedRowKeys);

  }

  render() {
    const { officialSlots, onSelectionChange, selectedRowKeys } = this.props;

    let rowSelection;
    if (onSelectionChange){

      rowSelection = {
        selectedRowKeys,
        onSelectAll: (selected, selectedRows, changeRows) => selected ? this.onSelectChange(officialSlots.map(item => item.id)) : this.onSelectChange([] ),
        onChange: this.onSelectChange,
      };
    }



    return <Table
      rowSelection={rowSelection}
      rowKey={'id'}
      locale={{
        emptyText: 'Keine Kampfrichter zugeteilt'
      }}
      columns={[
        {
          dataIndex: 'official.name',
          title: 'Name',
          render: (text, item) => _.get(item, 'official.name')
        },
        {
          dataIndex: 'position',
          title: 'Position',
          render: (text, item) => _.get(item, 'position')
        }
      ]}
      dataSource={officialSlots}
    />;
  }
}

export default OfficialSlotsTable;
