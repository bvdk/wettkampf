// @flow
import React, {Component} from 'react';
import AthleteName from "../../../components/AthleteName";
import Toolbar from "../../../components/Toolbar";
import AthleteDeleteButton from "../../../components/AthleteDeleteButton";
import AthleteDashboard from "../../../components/AthleteDashboard";
import {withRouter} from "react-router";
import BackButton from "../../../components/BackButton";

import _ from "lodash";

type Props = {

};

type State = {

}

class EventAthleteRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { athleteId, history, eventId } = this.props;

    return <div>
      <Toolbar
        renderLeft={()=><span>
                <BackButton />
                <h3 style={{display: 'inline', marginLeft: 8}}><AthleteName athleteId={athleteId}/></h3>
              </span>}
        renderRight={() => [
          <AthleteDeleteButton key={'delete'} athleteId={athleteId} onDelete={()=>{ history.goBack() }}/>
        ]}/>
      <hr/>
      <div style={{padding: 10}}>
        <AthleteDashboard eventId={eventId} athleteId={athleteId}/>
      </div>
    </div>;;
  }
}

export default withRouter(EventAthleteRoute);
