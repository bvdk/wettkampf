// @flow
import React, { Component } from 'react';
import EventUpdateForm from "../../../components/EventUpdateForm";
import _ from "lodash";
import EventAthletesTable from "../../../components/EventAthletesTable";
import Toolbar from "../../../components/Toolbar";
import {Button} from "antd";
import {Link} from "react-router-dom";
import IfRole from "../../../hoc/ifRole";

type Props = {
  eventId: string,
};

type State = {

}

class EventAthletesRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { eventId, history } = this.props;

    return <div>
      <Toolbar
        renderLeft={() => <h3>Alle Athleten</h3>}
        renderRight={() => <IfRole>
          <Link key={"new"} to={`athletes/new`}><Button>Neu</Button></Link>
          <Link style={{paddingLeft: '10px'}} key={"import"} to={`athletes/import`}><Button>Import</Button></Link>
            </IfRole>
        }/>
      <hr/>
      <EventAthletesTable onAthleteClick={(athlete) => history.push(`/events/${eventId}/athletes/${athlete.id}`)} eventId={eventId}/>
    </div>;
  }
}

export default EventAthletesRoute;
