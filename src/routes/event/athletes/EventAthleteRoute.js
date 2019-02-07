// @flow
import React, { Component } from 'react';

import {Link} from "react-router-dom";
import {Button} from "antd";
import AthleteName from "../../../components/AthleteName";
import Toolbar from "../../../components/Toolbar";
import AthleteUpdateForm from "../../../components/AthleteUpdateForm";
import AthleteDashboard from "../../../components/AthleteDashboard";

type Props = {

};

type State = {

}

class EventAthleteRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { athleteId } = this.props;

    return <div>
      <Toolbar
        renderLeft={() => <h3><AthleteName athleteId={athleteId}/></h3>}
        renderRight={() => [

        ]}/>
      <hr/>
      <div style={{padding: 10}}>
        <AthleteDashboard athleteId={athleteId}/>
      </div>
    </div>;;
  }
}

export default EventAthleteRoute;
