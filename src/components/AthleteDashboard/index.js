// @flow
import React, { Component } from 'react';
import {Col, Row} from "antd";
import AthleteUpdateForm from "./../AthleteUpdateForm";

type Props = {
  athleteId: string
};

type State = {

}

class AthleteDashboard extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { athleteId } = this.props;

    return <Row gutter={16}>
      <Col md={12}>
        <h4>Bearbeiten</h4>
        <AthleteUpdateForm athleteId={athleteId} />
      </Col>
      <Col md={12}>
        <h4>Ergebnisse</h4>
        <span>TODO</span>
      </Col>

    </Row>;
  }
}

export default AthleteDashboard;
