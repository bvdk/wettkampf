// @flow
import React, {Component} from 'react';
import {loader} from "graphql.macro";
import BackButton from "./../BackButton";
import {compose, graphql} from "react-apollo";
import _ from "lodash";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import {mapProps} from "recompose";
import styled from "styled-components";
import Toolbar from "../Toolbar";
import {Link} from "react-router-dom";
import {Col, Row} from "antd";
import ContentWrapper from "./../ContentWrapper";
import AthleteGroupAthletesCard from "../AthleteGroupAthletesCard";

const EventAthleteGroupQuery = loader("../../graphql/queries/athleteGroup.graphql");

const Header = styled.div`
    padding: 10px;
`


type Props = {
    eventId: string,
    athleteGroupId: string,
};

class EventAthleteGroupDashboard extends Component<Props> {
  props: Props;

  render() {

      const {eventId, athleteGroupId, athleteGroup} = this.props;

    return (
      <div>
          <Toolbar
              borderBottom
              renderLeft={()=><span>
                <BackButton />
                <h3 style={{display: 'inline', marginLeft: 8}}>{_.get(athleteGroup,'name')}</h3>
              </span>}
              renderRight={()=> <Link to={`/events/${eventId}/athleteGroups/${athleteGroupId}/edit`}>Bearbeiten</Link>}
          />

        <AthleteGroupAthletesCard eventId={eventId} athleteGroupId={athleteGroupId}/>

      </div>
    );
  }
}

export default compose(
    graphql(EventAthleteGroupQuery, {
        name: 'eventAthleteGroupQuery',
        options: (props: Props) => ({
          variables: {
              id: props.athleteGroupId
          }
        })
    }),
    waitWhileLoading('eventAthleteGroupQuery'),
    mapProps(({eventId, athleteGroupId, eventAthleteGroupQuery})=>({
        eventId,
        athleteGroupId,
        athleteGroup: _.get(eventAthleteGroupQuery,'athleteGroup')
    })),
)(EventAthleteGroupDashboard);
