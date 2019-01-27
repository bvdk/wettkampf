// @flow
import React, { Component } from 'react';
import {Tabs, Panel} from "antd";
import _ from "lodash";
import styled from "styled-components";

import AthleteGroupCreateForm from "../../../../components/AthleteGroupCreateForm";
import Infobox from "../../../../components/Infobox";

const TabPane = Tabs.TabPane;

type Props = {
    eventId: string,
};

const Wrapper = styled.div`
    padding: 10px;
`

export default class EventAthleteGroupRoute extends Component<Props> {
  props: Props;

  render() {

      const { match, history } = this.props;

    return (
        <div>

        </div>
    );
  }
}
