// @flow
import React, { Component } from 'react';
import {Col, Row} from "antd";
import EventMenu from "./menu";
import {loader} from "graphql.macro";

const EventFormDataQuery = loader("../../graphql/queries/eventFormData.graphql");

type Props = {
    eventId: string,
};

export default class EventDashboard extends Component<Props> {
  props: Props;

  render() {

      const {eventId} = this.props;

    return (
      <div></div>
    );
  }
}

