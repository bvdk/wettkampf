// @flow
import React, { Component } from 'react';
import {Tabs, Panel} from "antd";
import _ from "lodash";
import styled from "styled-components";

import AthleteGroupCreateForm from "./../../../components/AthleteGroupCreateForm";
import Infobox from "./../../../components/Infobox";

const TabPane = Tabs.TabPane;

type Props = {
    eventId: string,
};

const Wrapper = styled.div`
    padding-left: 15px;
    padding-right: 15px;
`

export default class EventAthleteGroupCreateRoute extends Component<Props> {
  props: Props;

  render() {

      const { match, history } = this.props;

      const eventId = this.props.eventId || _.get(match, 'params.eventId');
      const tabIndex = _.get(match, 'params.tabIndex');

    return (
        <Tabs defaultActiveKey={tabIndex} onChange={(key)=> history.push(`/events/${eventId}/athleteGroups/new/${key}`)}>
            <TabPane tab="Neue Startgruppe" key="single">
                <Wrapper>
                    <h3>Neue Startgruppe erstellen</h3>
                    <hr/>
                    <Infobox>
                        <span>Startgruppen können einer Alter- oder Gewichtsklasse zugeordnet werden. Durch die eingestellten Rahmenbedingungen können Athleten automatisiert zugeordnet werden.</span>
                    </Infobox>
                    <div style={{padding: 10}}/>
                    <AthleteGroupCreateForm eventId={eventId}/>
                </Wrapper>

            </TabPane>
            <TabPane tab="Automatisch Erstellen" key="automatic">

            </TabPane>
        </Tabs>
    );
  }
}
