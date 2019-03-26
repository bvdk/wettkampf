// @flow
import React, { Component } from 'react';
import {Button} from "antd";
import {loader} from "graphql.macro";
import {graphql, compose} from "react-apollo";

const AutoCalcAthletePointsMutation = loader("../../graphql/mutations/autoCalcEventAthletePoints.graphql");

type Props = {
  eventId: string,
  loading: boolean,
  autoCalcAthletePointsMutation: Function,
};

type State = {

}

class EventAthletePointsCalcButton extends Component<Props, State> {

  state = {
    loading: false
  }

  _handleClick = () => {

    const {autoCalcAthletePointsMutation} = this.props;

    this.setLoading(true)
      .then(() => {
        return autoCalcAthletePointsMutation()
      })
      .then(() => {
        this.setLoading(false);
      })
  }

  setLoading = (loading) => {
          return new Promise((resolve) => {
              this.setState({
                  loading
              }, resolve)
          })
      }

  render() {
    const { loading } = this.state;

    return <Button onClick={this._handleClick} loading={loading} icon={'reload'} >Reihenfolge aktualisieren</Button>;
  }
}

export default compose(
  graphql(AutoCalcAthletePointsMutation,{
    name: 'autoCalcAthletePointsMutation',
    options: (props) => ({
      variables: {
        eventId: props.eventId
      }
    })
  }),
)(EventAthletePointsCalcButton);
