// @flow
import React, {Component} from 'react';
import {loader} from 'graphql.macro';
import _ from 'lodash'
import {compose, graphql} from "react-apollo";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import AthletesTable from "../AthletesTable";
import {mapProps} from "recompose";

const EventAthletesQuery = loader("../../graphql/queries/eventAthletesQuery.graphql");


type Props = {
  eventId: string,
  athletes: any[],
};

type State = {

}

class EventAthletesTable extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { athletes } = this.props;

    return <AthletesTable athletes={athletes}/>
  }
}

export default compose(
  graphql(EventAthletesQuery, {
    name: 'eventAthletesQuery',
    options: (props: Props) =>({
      variables: {
        eventId: props.eventId
      }
    }),
  }),
  waitWhileLoading('eventAthletesQuery'),
  mapProps((props)=>({
    athletes: _.get(props,'eventAthletesQuery.event.athletes',[])
  }))
)(EventAthletesTable);
