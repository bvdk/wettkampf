// @flow
import React, {Component} from 'react';
import {Tabs} from "antd";
import _ from "lodash";
import styled from "styled-components";

import AthleteGroupCreateForm from "./../../../components/AthleteGroupCreateForm";
import Infobox from "./../../../components/Infobox";
import AthleteGroupAutomaticCreationWizard from "../../../components/AthleteGroupAutomaticCreationWizard";

const TabPane = Tabs.TabPane;

type Props = {
    eventId: string,
};

const Wrapper = styled.div`
    padding-left: 15px;
    padding-right: 15px;
`;

export default class EventAthleteGroupCreateRoute extends Component<Props> {
    props: Props;

    render() {
        const {match, history} = this.props;

        const eventId = this.props.eventId || _.get(match, 'params.eventId');
        const tabIndex = _.get(match, 'params.tabIndex');

        return (
            <Tabs defaultActiveKey={tabIndex}
                  onChange={(key) => history.push(`/events/${eventId}/athleteGroups/new/${key}`)}>
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
                    <Wrapper>
                        <h3>Startgruppen automatisch erstellen</h3>
                        <hr/>
                        <Infobox>
                            <span>Startgruppen können einer Alter- oder Gewichtsklasse zugeordnet werden. Durch die eingestellten Rahmenbedingungen können Athleten automatisiert zugeordnet werden.</span><br/>
                            <span>Mit dem automatischen Erstellen von Startgruppen werden Athleten die noch keiner Startgruppe zugeordnet sind automatisch in Gruppen eingeordnet.
                        Sie können bestimmen nach welchen Kriterien Startgruppen erstellt werden sollen.</span>
                        </Infobox>
                        <div style={{padding: 10}}/>
                        <AthleteGroupAutomaticCreationWizard
                            onCreated={() => history.push(`/events/${eventId}/athleteGroups`)} eventId={eventId}/>
                    </Wrapper>
                </TabPane>
            </Tabs>
        );
    }
}
