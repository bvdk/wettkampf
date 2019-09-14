// @flow
import React, { Component } from 'react';
import { Table } from 'antd';
import { compose, graphql } from 'react-apollo';
import { loader } from 'graphql.macro';

const DeleteSlotMutation = loader(
  '../../../graphql/mutations/deleteSlot.graphql'
);
const SlotsQuery = loader('../../../graphql/queries/eventSlots.graphql');

type Props = {
  slots: any[],
  onClick?: Function
};

class SlotsTable extends Component<Props> {
  props: Props;

  _handleRemove = record => {
    this.props.deleteMutation({
      variables: {
        id: record.id
      },
      refetchQueries: [
        {
          query: SlotsQuery,
          variables: {
            eventId: record.eventId
          }
        }
      ]
    });
  };

  render() {
    const { slots, onClick } = this.props;

    const columns = [
      {
        title: 'Bezeichnung',
        dataIndex: 'name',
        onCell: record => ({
          onClick: () => {
            if (onClick) {
              onClick(record);
            }
          }
        })
      },
      {
        title: 'Athleten',
        dataIndex: 'athleteCount',
        onCell: record => ({
          onClick: () => {
            if (onClick) {
              onClick(record);
            }
          }
        })
      },
      {
        title: 'Aktion',
        key: 'action',
        render: (text, record) => (
          <button
            className="link-button"
            onClick={() => {
              this._handleRemove(record);
            }}>
            Löschen
          </button>
        )
      }
    ];

    return <Table rowKey={'id'} columns={columns} dataSource={slots} />;
  }
}

export default compose(
  graphql(DeleteSlotMutation, {
    name: 'deleteMutation',
    options: ({ eventId }) => ({
      refetchQueries: [
        {
          query: SlotsQuery,
          variables: {
            eventId
          }
        }
      ]
    })
  })
)(SlotsTable);
