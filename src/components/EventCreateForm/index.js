// @flow
import React, { Component } from 'react';
import {compose, graphql} from "react-apollo";

import { loader } from 'graphql.macro';
import EventForm from "../EventForm";
const CreateEventMutation = loader("../../graphql/mutations/createEvent.graphql");

type Props = {
  createEventMutation: Function,
  onCreate: Function,
};

type State = {

}

class EventCreateForm extends Component<Props, State> {
  componentDidMount() {}

  render() {

    return <EventForm
              onSubmit={this.props.onCreate}
              mutation={this.props.createEventMutation}
              translateMutationOptions={(data) => ({
                variables: {
                  data
                },
              })}
    />;
  }
}

export default compose(
  graphql(CreateEventMutation, {
    name: 'createEventMutation',
  }),
)(EventCreateForm);
