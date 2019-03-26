// @flow
import React, { Component } from 'react';
import {loader} from "graphql.macro";
import {compose, graphql} from "react-apollo";
import _ from "lodash";
import {withProps} from "recompose";
import {Button, Table} from "antd";
import Toolbar from "../Toolbar";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import EventAthletePointsCalcButton from "./../EventAthletePointsCalcButton";

const EventAttemptsQuery = loader("../../graphql/queries/eventAttempts.graphql");

type Props = {

};

type State = {

}

class OrderedEventAthletes extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { athletes } = this.props;

    return <Table
      size={'small'}
      pagination={false}
      columns={[{
        dataIndex: '#',
        title: '#',
        width: 30,
      },{
        dataIndex: 'name',
        title: 'Name',
      },{
        dataIndex: 'nextAttempt.weight',
        title: 'Versuch',
        render: (text, item) => {
          const weight = _.chain(item).get('nextAttempts[0].weight').value();
          if (weight){
            return `${weight} kg`;
          }
          return null
        }
      }]}
      dataSource={athletes}
      footer={() => <Toolbar
        style={{padding: 0}}
        renderLeft={() => <span>{athletes.length} Athleten</span>}
        renderRight={() => <EventAthletePointsCalcButton eventId={this.props.eventId} />}
      />}
    />;
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

  waitWhileLoading('eventAttemptsQuery'),
  withProps((props)=>({
    loading: _.get(props,'eventAttemptsQuery.loading',false),
    eventId: props.eventId,
    onAthleteClick: props.onAthleteClick,
    availableDisciplines: _.get(props,'eventAttemptsQuery.event.availableDisciplines',[]),
    athletes: _.get(props,'eventAttemptsQuery.event.athletes',[]).map((item, index)=> ({
      ...item,
      '#': index+1
    }))
  }))
)(OrderedEventAthletes);

