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
  eventAttemptsQuery: any,
};

type State = {

}

const EventAttemptsQuery = loader("../../graphql/queries/eventAttempts.graphql");

class EventAttempts extends Component<Props, State> {

  _handleAttemptChange = (res) => {
    this.props.eventAttemptsQuery.refetch();
  }

  render() {
    const { athletes, availableDisciplines, loading, filterParams } = this.props;
    return <div>

      <AttemptsTable
        editableAttemptCols
        onChange={this._handleAttemptChange}
        filterParams={filterParams}
        tableProps={{loading}}
        loading={loading}
        availableDisciplines={availableDisciplines}
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
  graphql(EventAttemptsQuery, {
    name: 'eventAttemptsQuery',
    options: (props: Props) =>{

      const discipline = _.get(props,'filterParams.discipline');
      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          eventId: props.eventId,
          discipline,
          filters: getFilterParams(_.get(props,'filterParams')),
          sort: discipline ? [{
            name: `nextAttemptsSortKeys.${discipline}`,
            direction: 'ASC'
          }] : null
        }
      }
    },
  }),
  withProps((props)=>({
    loading: _.get(props,'eventAttemptsQuery.loading',false),
    eventId: props.eventId,
    onAthleteClick: props.onAthleteClick,
    availableDisciplines: _.get(props,'eventAttemptsQuery.event.availableDisciplines',[]),
    athletes: _.get(props,'eventAttemptsQuery.event.athletes',[])
  }))
)(EventAttempts);

