// @flow
import React, { Component } from 'react';
import { Button, Dropdown, Icon, Menu, Modal } from 'antd';
import { loader } from 'graphql.macro';
import { graphql, compose } from 'react-apollo';
import SlotAthleteGroupActivationForm from '../../Slot/AthleteGroupActivationForm';

const AutoCalcAthletePointsMutation = loader(
  '../../../graphql/mutations/autoCalcEventAthletePoints.graphql'
);

type Props = {
  eventId: string,
  slotId: string,
  loading: boolean,
  autoCalcAthletePointsMutation: Function
};

type State = {
  loading: boolean
};

class EventAthletePointsCalcButton extends Component<Props, State> {
  state = {
    loading: false
  };

  handleClick = () =>
    this.setLoading(true)
      .then(this.props.autoCalcAthletePointsMutation)
      .then(() => this.setLoading(false));

  setLoading = loading =>
    new Promise(resolve => this.setState({ loading }, resolve));

  render() {
    const { loading } = this.state;

    return (
      <div>
        <Button onClick={this.handleClick} loading={loading} icon={'reload'}>
          Aktualisieren
        </Button>
      </div>
    );
  }
}

export default compose(
  graphql(AutoCalcAthletePointsMutation, {
    name: 'autoCalcAthletePointsMutation',
    options: props => ({
      variables: {
        eventId: props.eventId
      }
    })
  })
)(EventAthletePointsCalcButton);
