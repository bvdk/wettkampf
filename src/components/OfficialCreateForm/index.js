// @flow
import React, {Component} from 'react';
import {compose, graphql} from "react-apollo";
import {loader} from 'graphql.macro';

import OfficialForm from "../OfficialForm";

const CreateOfficialMutation = loader("../../graphql/mutations/createOfficial.graphql");
const EventOfficialsQuery = loader("../../graphql/queries/eventOfficials.graphql");

type Props = {
  createEventMutation: Function,
  onCreate: Function,
  eventId: string,
};

type State = {

}

class OfficialCreateForm extends Component<Props, State> {

  render() {

    return <OfficialForm
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
  graphql(CreateOfficialMutation, {
    name: 'mutation',
    options: (props) => ({
      refetchQueries: [{
        query: EventOfficialsQuery,
        variables: {
          eventId: props.eventId
        }
      }]
    })
  }),
)(OfficialCreateForm);
