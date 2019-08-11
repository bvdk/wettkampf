// @flow
import React from 'react';
import {Route, Switch} from 'react-router';
import _ from 'lodash';
import EventAthleteGroupsDashboard from "./../../../components/EventAthleteGroupsDashboard";
import EventAthleteGroupCreateRoute from "./EventAthleteGroupCreateRoute";
import RedirectWithParams from "../../Redirect";
import EventAthleteGroupRoute from "./athleteGroup";

export default (props) => {

    const {match, history} = props;

    const eventId = props.eventId || _.get(match, 'params.eventId');

    return <Switch>
        <Route path="/events/:eventId/athleteGroups/new/:tabIndex" component={EventAthleteGroupCreateRoute} />
        <RedirectWithParams from="/events/:eventId/athleteGroups/new" to={"/events/:eventId/athleteGroups/new/single"} />
        <Route path="/events/:eventId/athleteGroups/:athleteGroupId" component={EventAthleteGroupRoute} />
        <Route path="/events/:eventId/athleteGroups" component={() => <div><EventAthleteGroupsDashboard eventId={eventId} onClickAthleteGroup={({id}) => history.push(`/events/${eventId}/athleteGroups/${id}`)} /></div>} />
    </Switch>
}
;
