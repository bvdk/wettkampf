// @flow
/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import React, {Fragment, Component} from 'react';
import {Divider, Table} from "antd";
import {graphql, compose} from "react-apollo";
import {loader} from 'graphql.macro';
import {withProps} from "recompose";
import {Link} from "react-router-dom";

const DeleteEventMutation = loader("../../graphql/mutations/deleteEvent.graphql");
const EventsQuery = loader("../../graphql/queries/events.graphql");

type Props = {
    events: Event[],
    onRemove?: ?Function,
    onClick?: (event: any) => void
};

const tableCSS = css({
    '& thead > tr': {
        cursor: 'pointer'
    },
    '& tbody > tr': {
        cursor: 'pointer'
    }
});
console.log(tableCSS)

class EventTable extends Component<Props> {
    props: Props;

    static defaultProps = {
        onEdit: undefined,
        onRemove: undefined,
        onClick: undefined
    };

    render() {
        const {events, onEdit, onRemove, onClick} = this.props;

        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                onCell: (record) => ({
                    onClick: () => {
                        if (onClick) {
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
                        if (onClick) {
                            onClick(record);
                        }
                    }
                })
            },
        ];

        if (onEdit || onRemove) {
            columns.push({
                title: 'Aktion',
                key: 'action',
                render: (text, record) => <span>
                    <Link to={`events/${record.id}/edit`}>Bearbeiten</Link>
                    {this.props.onRemove ? <Fragment>
                        <Divider type="vertical"/>
                        <span>
                            <button className="link-button"
                                    onClick={() => {
                                        this.props.onRemove(record)
                                    }}>
                                Löschen
                            </button>
                        </span>
                    </Fragment> : null}
          </span>,
            });
        }

        return (
            <Table
                css={tableCSS}
                rowKey="id"
                pagination={events.length > 30}
                columns={columns}
                dataSource={events}
            />
        );
    }
}

export default compose(
    graphql(DeleteEventMutation, {
        name: 'deleteEventMutation',
        options: () => ({
            refetchQueries: [{
                query: EventsQuery
            }]
        })
    }),
    withProps((props) => ({
        onRemove: (event) => props.deleteEventMutation({
            variables: {
                id: event.id
            }
        })
    }))
)(EventTable)
