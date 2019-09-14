// @flow
import React, {Component} from 'react';
import AthleteName from "../../Athlete/Name";
import Toolbar from "../../Toolbar";
import AthleteDeleteButton from "../../Athlete/DeleteButton";
import AthleteDashboard from "../../Athlete/Dashboard";
import {withRouter} from "react-router";
import BackButton from "../../BackButton";

import IfRole from "../../../hoc/ifRole";

type Props = {};

type State = {};

class EventAthleteRoute extends Component<Props, State> {
  render() {
    const { athleteId, history, eventId } = this.props;

    return <IfRole>
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
    </IfRole>
  }
}

export default withRouter(EventAthleteRoute);
