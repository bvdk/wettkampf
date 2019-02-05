// @flow
import React, {Component} from 'react';
import AttemptsTable from "../AttemptsTable";
import {loader} from "graphql.macro";
import {compose, graphql} from "react-apollo";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import {withProps} from "recompose";
import _ from "lodash";

type Props = {
  eventId: string,
  discipline: string,
};

type State = {

}

const EventAttemptsQuery = loader("../../graphql/queries/eventAthletesQuery.graphql");

class EventAttempts extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { eventId, athletes } = this.props;

    return <div>

      <AttemptsTable athletes={athletes} />
    </div>;
  }
}

export default compose(
  graphql(EventAttemptsQuery, {
    name: 'eventAttemptsQuery',
    options: (props: Props) =>({
      variables: {
        eventId: props.eventId,
        discipline: props.discipline,
      }
    }),
  }),
  waitWhileLoading('eventAttemptsQuery'),
  withProps((props)=>({
    eventId: props.eventId,
    onAthleteClick: props.onAthleteClick,
    disciplines: _.get(props,'eventAttemptsQuery.event.availableDisciplines',[]),
    athletes: _.get(props,'eventAttemptsQuery.event.athletes',[])
  }))
)(EventAttempts);

