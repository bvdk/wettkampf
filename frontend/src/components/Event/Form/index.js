// @flow
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import _ from 'lodash';
import { loader } from 'graphql.macro';
import { mapProps } from 'recompose';
import EventForm from '../EventForm';
import waitWhileLoading from '../../../hoc/waitWhileLoading';

const CreateEventMutation = loader(
  '../../../graphql/mutations/updateEvent.graphql'
);
const EventFormDataQuery = loader(
  '../../../graphql/queries/eventFormData.graphql'
);

type WrapperProps = {
  eventId: string
};

type ConnectedProps = {
  eventId: string,
  values: any,
  eventMutation: Function,
  onEdit: Function
};

type State = {};

class EventUpdateForm extends Component<ConnectedProps, State> {
  render() {
    const { values, eventMutation, onEdit, eventId } = this.props;

    return (
      <EventForm
        onSubmit={onEdit}
        data={values}
        mutation={eventMutation}
        translateMutationOptions={data => ({
          variables: {
            id: eventId,
            data
          }
        })}
      />
    );
  }
}

export default compose(
  graphql(EventFormDataQuery, {
    name: 'eventFormDataQuery',
    options: (props: WrapperProps) => ({
      variables: {
        id: props.eventId
      }
    })
  }),
  waitWhileLoading('eventFormDataQuery'),
  mapProps(({ onEdit, eventId, eventFormDataQuery }) => ({
    eventId,
    onEdit,
    values: _.get(eventFormDataQuery, 'event')
  })),
  graphql(CreateEventMutation, {
    name: 'eventMutation'
  })
)(EventUpdateForm);
