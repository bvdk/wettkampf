// @flow
import React, {Component} from 'react';
import queryString from "query-string";
import {compose, graphql} from "react-apollo";
import {mapProps} from "recompose";
import _ from "lodash";
import {loader} from "graphql.macro";
import EventResults from "./../../../components/EventResults";
import EventResultsToolbar from "../../../components/EventResultsToolbar";
import waitWhileLoading from "../../../hoc/waitWhileLoading";

const EventDisciplinesQuery = loader("../../../graphql/queries/eventDisciplines.graphql");
const EventResultClassesQuery = loader("../../../graphql/queries/eventResultClasses.graphql");


type Props = {
  eventId: string,
};

type State = {

}

class EventResultsRoute extends Component<Props, State> {

  _handleSearchParamsChange = (params) => {
    this.props.history.push(`?${queryString.stringify(params)}`)
  }

  render() {
    const { queryParameters, eventId, availableDisciplines } = this.props;

    let tmpParams = {
      ...queryParameters,
    }

    return <div>
      <EventResultsToolbar
        onChange={this._handleSearchParamsChange}
        availableDisciplines={availableDisciplines}
        eventId={eventId}
        params={tmpParams}/>
      <hr/>
      <EventResults availableDisciplines={availableDisciplines} filterParams={tmpParams} eventId={eventId}/>
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
  mapProps((props)=>({
    loading: _.get(props,'eventDisciplinesQuery.loading'),
    history: props.history,
    queryParameters: queryString.parse(_.get(props, 'history.location.search')),
    eventId: props.eventId,
    discipline: _.get(props,'eventDisciplinesQuery.event.discipline'),
    availableDisciplines: _.get(props,'eventDisciplinesQuery.event.availableDisciplines',[]),
  }))
)(EventResultsRoute);

