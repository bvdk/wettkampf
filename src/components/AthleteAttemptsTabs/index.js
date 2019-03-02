// @flow
import React, { Component } from 'react';
import {graphql, compose} from "react-apollo";
import _ from 'lodash'
import {loader} from "graphql.macro";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import {Tabs} from "antd";
import {withNamespaces} from "react-i18next";
import AthleteDashboard from "../AthleteDashboard";
import AthleteAttemptsForm from "../AthleteAttemptsForm";

const EventDisciplinesQuery = loader("../../graphql/queries/eventDisciplines.graphql");
const AthleteQuery = loader("../../graphql/queries/athleteAttempts.graphql");

type Props = {

};

type State = {

}

class AthleteAttemptsTabs extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { eventDisciplinesQuery, t, athleteId } = this.props;

    const availableDisciplines = _.get(eventDisciplinesQuery, 'event.availableDisciplines',[]);

    return <div>
      <Tabs >
        {availableDisciplines.map((dis)=>{
          return <Tabs.TabPane tab={t(dis)} key={dis}>
            <AthleteAttemptsForm athleteId={athleteId} discipline={dis}/>
          </Tabs.TabPane>
        })}


      </Tabs>
    </div>;
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
  graphql(AthleteQuery,{
    name: 'athleteQuery',
    options: (props: Props) =>({
      variables: {
        id: props.athleteId
      }
    }),
  }),
  waitWhileLoading('athleteQuery'),
  withNamespaces()
)(AthleteAttemptsTabs);
