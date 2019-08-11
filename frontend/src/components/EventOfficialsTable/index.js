// @flow
import React, { Component } from 'react';
import _ from 'lodash'
import {Link} from "react-router-dom";
import {Divider, Table} from "antd";
import {compose, graphql} from "react-apollo";
import {withProps} from "recompose";
import {loader} from "graphql.macro";
import waitWhileLoading from "../../hoc/waitWhileLoading";

type Props = {
  deleteOfficialMutation: Function,
  eventId: string,
  eventOfficialsQuery: any
};

type State = {}

const DeleteOfficialMutation = loader("../../graphql/mutations/deleteOfficial.graphql");
const EventOfficialsQuery = loader("../../graphql/queries/eventOfficials.graphql");

class EventOfficialsTable extends Component<Props, State> {


  static defaultProps = {
    onEdit: undefined,
    onRemove: undefined,
    onClick: undefined
  }

  render() {

    const {officials, onEdit, eventId, onRemove, onClick} = this.props;

    const defaultCellClick = (record) => ({
      onClick: () => {
        if (onClick){
          onClick(record);
        }
      }
    });

    const columns = [
      {
        title: 'Vorname',
        dataIndex: 'firstName',
        key: 'firstName',
        onCell: defaultCellClick
      },
      {
        title: 'Nachname',
        dataIndex: 'lastName',
        key: 'lastName',
        onCell: defaultCellClick
      },
      {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
        onCell: defaultCellClick
      },
      {
        title: 'Ort',
        dataIndex: 'location',
        key: 'location',
        onCell: defaultCellClick
      },
      {
        title: 'Lizenz',
        dataIndex: 'license',
        key: 'license',
        onCell: defaultCellClick
      },
    ]

    if (onEdit || onRemove){
      columns.push({
        title: 'Aktion',
        key: 'action',
        render: (text, record) => (
          <span>
            <Link to={`events/${eventId}/officials/${record.id}/edit`}>Bearbeiten</Link> {this.props.onRemove ? <Divider type="vertical" />: null }
            { this.props.onRemove ?<span><button className="link-button" onClick={()=>{this.props.onRemove(record)}}>Löschen</button></span>
              : null }
          </span>
        ),
      });
    }

    return (
      <Table
        rowKey="id"
        size={"middle"}
        pagination={officials.length > 30}
        columns={columns}
        dataSource={officials}
      />
    );
  }

}

export default compose(
  graphql(DeleteOfficialMutation, {
    name: 'deleteOfficialMutation',
    options: (props) => ({
      refetchQueries: [{
        query: EventOfficialsQuery,
        variables: {
          eventId: props.eventId
        }
      }]
    })
  }),
  graphql(EventOfficialsQuery,{
    name: 'eventOfficialsQuery',
    options: (props) => ({
      variables: {
        eventId: props.eventId
      }
    })
  }),
  waitWhileLoading('eventOfficialsQuery'),
  withProps((props) => ({
    officials: _.get(props,'eventOfficialsQuery.event.officials',[]),
    onRemove: (event) => props.deleteOfficialMutation({
      variables: {
        id: event.id
      }
    })
  }))
)(EventOfficialsTable)
