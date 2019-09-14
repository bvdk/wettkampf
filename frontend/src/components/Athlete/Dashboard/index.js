// @flow
import React, { Component } from 'react';
import {Col, Row} from "antd";
import AthleteUpdateForm from "../UpdateForm";
import Panel from "../../Panel";
import AthleteAttemptsTabs from "../AttemptsTabs";

type Props = {
  athleteId: string,
  eventId: string,
};

type State = {

}

class AthleteDashboard extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { athleteId, eventId } = this.props;

    return <Row gutter={16}>
      <Col md={12}>
        <Panel title={'Stammdaten'}>
          <AthleteUpdateForm athleteId={athleteId} />
        </Panel>
      </Col>
      <Col md={12}>
        <Panel title={'Versuche'}>
          <AthleteAttemptsTabs athleteId={athleteId} eventId={eventId}/>
        </Panel>
      </Col>

    </Row>;
  }
}

export default AthleteDashboard;
