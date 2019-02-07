// @flow
import React, {Component} from 'react';
import AttemptsTable from "../AttemptsTable";
import {loader} from "graphql.macro";
import {compose, graphql} from "react-apollo";
import {withProps} from "recompose";
import _ from "lodash";

type Props = {
  eventId: string,
  filterParams: any,
  eventResultsQuery: any,
};

type State = {

}

const EventResultsQuery = loader("../../graphql/queries/eventResults.graphql");

class EventResults extends Component<Props, State> {


  _handleResultChange = (res) => {
    this.props.eventResultsQuery.refetch();
  }

  render() {
    const { athletes, loading, filterParams, availableDisciplines } = this.props;
    return <div>

      <AttemptsTable
        availableDisciplines={availableDisciplines}
        onChange={this._handleResultChange}
        filterParams={filterParams}
        tableProps={{loading}}
        loading={loading}
        athletes={athletes} />
    </div>;
  }
}

const getFilterParams = (filterParams) => {

  const tmp = [];

  if (filterParams.athleteGroupId){
    tmp.push({
      value: filterParams.athleteGroupId,
      index: 'athleteGroupId'
    })
  }

  if (filterParams.slotId){
    tmp.push({
      value: filterParams.slotId,
      index: 'slotId'
    })
  }
  return tmp.length ? tmp : null;
}

export default compose(
  graphql(EventResultsQuery, {
    name: 'eventResultsQuery',
    options: (props: Props) =>({
      fetchPolicy: 'cache-and-network',
      variables: {
        eventId: props.eventId,
        filters: getFilterParams(_.get(props,'filterParams'))
      }
    }),
  }),
  withProps((props)=>({
    loading: _.get(props,'eventResultsQuery.loading',false),
    eventId: props.eventId,
    onAthleteClick: props.onAthleteClick,
    athletes: _.get(props,'eventResultsQuery.event.athletes',[])
  }))
)(EventResults);

