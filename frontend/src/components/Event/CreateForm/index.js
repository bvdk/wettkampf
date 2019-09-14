// @flow
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';

import { loader } from 'graphql.macro';
import EventForm from '../EventForm';

const CreateEventMutation = loader(
  '../../../graphql/mutations/createEvent.graphql'
);
const EventsQuery = loader('../../../graphql/queries/events.graphql');

type Props = {
  createEventMutation: Function,
  onCreate: Function
};

class EventCreateForm extends Component<Props, {}> {
  render() {
    return (
      <EventForm
        onSubmit={this.props.onCreate}
        mutation={this.props.createEventMutation}
        translateMutationOptions={data => ({
          variables: {
            data
          }
        })}
      />
    );
  }
}

export default compose(
  graphql(CreateEventMutation, {
    name: 'createEventMutation',
    options: () => ({
      refetchQueries: [
        {
          query: EventsQuery
        }
      ]
    })
  })
)(EventCreateForm);
