// @flow
import React, { Component } from 'react';
import Toolbar from "../../Toolbar";
import EventOfficialsTable from "../OfficialsTable";
import {Button, Icon} from "antd";
import {Link} from "react-router-dom";

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
        renderRight={() => <Link to={`/events/${eventId}/officials/new`}><Button><Icon type={'plus'}/> Neu</Button></Link>}
        borderBottom={true}/>

        <EventOfficialsTable eventId={eventId} onClick={(record)=> history.push(`/events/${eventId}/officials/${record.id}`) }/>
    </div>;
  }
}

export default EventOfficialsTableRoute;
