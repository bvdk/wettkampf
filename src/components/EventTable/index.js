// @flow
import React, { Component } from 'react';
import {Divider, Table} from "antd";
import * as _ from "lodash";

type Props = {
  events: Event[],
  onEdit?: ?Function,
  onRemove?: ?Function,
  onClick?: (event: any) => void
};




export default class EventTable extends Component<Props> {
  props: Props;

  static defaultProps = {
    onEdit: undefined,
    onRemove: undefined,
    onClick: undefined
  }

  render() {

    const {events, onEdit, onRemove, onClick} = this.props;

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        onCell: (record) => ({
          onClick: () => {
            if (onClick){
              onClick(record);
            }
          }
        })
      },
      {
        title: 'Disziplin',
        dataIndex: 'discipline',
        key: 'discipline',
        render: (text, record, index) => {
          const dis = null;//TODO Load disciplens
          return dis ? <span>{dis.name}</span> : null;
        },
        onCell: (record) => ({
          onClick: () => {
            if (onClick){
              onClick(record);
            }
          }
        })
      },
    ]

    if (onEdit || onRemove){
      columns.push({
        title: 'Aktion',
        key: 'action',
        render: (text, record) => (
          <span>
            { this.props.onEdit ?<span>
              <a onClick={()=>{this.props.onEdit(record)}}>Bearbeiten</a> {this.props.onRemove ? <Divider type="vertical" />: null }
            </span>
              : null }
            { this.props.onRemove ?<span><a onClick={()=>{this.props.onRemove(record)}}>Löschen</a></span>
              : null }
          </span>
        ),
      });
    }

    return (
      <Table
        rowKey="id"
        pagination={events.length > 30}
        columns={columns}
        dataSource={events}
      />
    );
  }
}
