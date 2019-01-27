// @flow
import React, {Component} from 'react';
import {loader} from 'graphql.macro';
import _ from 'lodash'
import {compose, graphql} from "react-apollo";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import AthletesTable from "../AthletesTable";
import {mapProps} from "recompose";
import Toolbar from "../Toolbar";
import {Button} from "antd";

const EventAthletesQuery = loader("../../graphql/queries/eventAthletesQuery.graphql");

type Props = {
  eventId: string,
  athletes: any[],
};

type State = {
  selectedAthleteIds: string[]
}

class EventAthletesTable extends Component<Props, State> {
  state = {
    selectedAthleteIds: [],
  }

  _handleSelectChange = (selectedAthleteIds) => {
    this.setState({
      selectedAthleteIds
    })
  };

  renderLeftTools = () => {

    const { selectedAthleteIds } = this.state;

    return <div>
      <Button disabled={!selectedAthleteIds.length} onClick={()=>{}}>Startgruppe zuweisen</Button>
    </div>
  }

  render() {
    const { athletes, onAthleteClick } = this.props;

    return <div>
      <Toolbar renderLeft={this.renderLeftTools}/>
      <AthletesTable onAthleteClick={onAthleteClick} onSelectChange={this._handleSelectChange} athletes={athletes}/>
    </div>
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
    onAthleteClick: props.onAthleteClick,
    athletes: _.get(props,'eventAthletesQuery.event.athletes',[])
  }))
)(EventAthletesTable);
