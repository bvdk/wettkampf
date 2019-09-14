// @flow
import React, {Component} from 'react';
import {compose, graphql} from "react-apollo";
import {loader} from 'graphql.macro';

import SlotForm from "../Form";

const CreateSlotMutation = loader("../../graphql/mutations/createSlot.graphql");
const EventSlotsQuery = loader("../../graphql/queries/eventSlots.graphql");

type Props = {
  createEventMutation: Function,
  onCreate: Function,
  eventId: string,
};

type State = {

}

class SlotCreateForm extends Component<Props, State> {

  render() {

    return <SlotForm
      onSubmit={this.props.onCreate}
      mutation={this.props.mutation}
      translateMutationOptions={(data) => ({
        variables: {
          eventId: this.props.eventId,
          data
        },
      })}
    />;
  }
}

export default compose(
  graphql(CreateSlotMutation, {
    name: 'mutation',
    options: (props) => ({
      refetchQueries: [{
        query: EventSlotsQuery,
        variables: {
          eventId: props.eventId
        }
      }]
    })
  }),
)(SlotCreateForm);
