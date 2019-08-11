// @flow
import React, {Component} from 'react';
import _ from 'lodash';
import OfficialCreateForm from "../../../components/OfficialCreateForm";
import Toolbar from "../../../components/Toolbar";
import BackButton from "../../../components/BackButton";

type Props = {
  eventId: string,
  history: any
};

type State = {

}

class EventOfficialCreateRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { eventId, history } = this.props;


    return <div>
      <Toolbar
        renderLeft={()=><span>
                <BackButton />
                <h3 style={{display: 'inline', marginLeft: 8}}>{`Neuer Kampfrichter`}</h3>
              </span>}

        borderBottom={true}/>

        <div style={{padding: 16}}>
          <OfficialCreateForm onCreate={(item) => {

            console.log(item);
            history.push(`/events/${eventId}/officials/${_.get(item,'data.createOfficial.id')}`)

          }} eventId={eventId}/>
        </div>
    </div>;
  }
}

export default EventOfficialCreateRoute;
