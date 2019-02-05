// @flow
import React, {Component} from 'react';
import queryString from "query-string";
import {compose, graphql} from "react-apollo";
import waitWhileLoading from "../../../hoc/waitWhileLoading";
import {mapProps} from "recompose";
import _ from "lodash";
import {loader} from "graphql.macro";
import EventAttempts from "./../../../components/EventAttempts";
import EventAttemptsToolbar from "../../../components/EventAttemptsToolbar";

const EventDisciplinesQuery = loader("../../../graphql/queries/eventDisciplines.graphql");


type Props = {
  eventId: string,
};

type State = {

}

class EventAttemptsRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { queryParameters, eventId, discipline, availableDisciplines } = this.props;

    return <div>
      <EventAttemptsToolbar availableDisciplines={availableDisciplines} eventId={eventId} params={queryParameters}/>
      <hr/>
      <EventAttempts discipline={discipline} eventId={eventId}/>
    </div>
  }
}

export default compose(
  graphql(EventDisciplinesQuery, {
    name: 'eventDisciplinesQuery',
    options: (props: Props) =>({
      variables: {
        id: props.eventId
      }
    }),
  }),
  waitWhileLoading('eventDisciplinesQuery'),
  mapProps((props)=>({
    queryParameters: queryString.parse(_.get(props, 'history.location.search')),
    eventId: props.eventId,
    discipline: _.get(props,'eventDisciplinesQuery.event.discipline'),
    availableDisciplines: _.get(props,'eventDisciplinesQuery.event.availableDisciplines',[]),
  }))
)(EventAttemptsRoute);

