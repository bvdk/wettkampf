// @flow
import React, { Component } from 'react';
import Toolbar from "../../../components/Toolbar";
import EventOfficialsTable from "./../../../components/EventOfficialsTable";

type Props = {
  eventId: string
};

type State = {

}

class EventOfficialsTableRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { eventId, history } = this.props;

    return <div>
      <Toolbar
        renderLeft={()=> <h3>{`Kampfrichter`}</h3>}
        borderBottom={true}/>

        <EventOfficialsTable eventId={eventId} onClick={(record)=> history.push(`/events/${eventId}/officials/${record.id}`) }/>
    </div>;
  }
}

export default EventOfficialsTableRoute;
