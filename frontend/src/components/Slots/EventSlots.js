// @flow
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import { withProps } from 'recompose';
import _ from 'lodash';
import { loader } from 'graphql.macro';
import { message, Button } from 'antd';
import SlotsTable from './Table';
import Toolbar from '../Toolbar';
import waitWhileLoading from '../../hoc/waitWhileLoading';

const CreateSlotMutation = loader('../../graphql/mutations/createSlot.graphql');
const EventSlotsQuery = loader('../../graphql/queries/eventSlots.graphql');

type Props = {
  eventId: string,
  onSlotClick: Function
};

class EventSlots extends Component<Props> {
  props: Props;

  _handleCreate = () => {
    const { eventId, createMutation } = this.props;
    createMutation({ eventId })
      .then(() => message.success('Bühne wurde erstellt'))
      .catch(() => message.error('Bühne konnte nicht erstellt werden'));
  };

  render() {
    const { slots, onSlotClick } = this.props;

    return (
      <div>
        <Toolbar
          renderLeft={() => <h3>Bühnen</h3>}
          renderRight={() => <Button onClick={this._handleCreate}>Neu</Button>}
        />
        <SlotsTable slots={slots} onClick={onSlotClick} />
      </div>
    );
  }
}

export default compose(
  graphql(CreateSlotMutation, {
    name: 'createMutation',
    options: ({ eventId }: Props) => ({
      variables: {
        eventId,
        data: {}
      },
      refetchQueries: [
        {
          query: EventSlotsQuery,
          variables: {
            eventId
          }
        }
      ]
    })
  }),
  graphql(EventSlotsQuery, {
    name: 'query',
    options: (props: Props) => ({
      variables: {
        eventId: props.eventId
      }
    })
  }),
  waitWhileLoading('query'),
  withProps(props => ({
    slots: _.get(props, 'query.event.slots', [])
  }))
)(EventSlots);
