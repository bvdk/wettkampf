// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import {Route, Switch} from "react-router";
import OfficialDashboardRoute from "./OfficialDashboardRoute";
import RedirectWithParams from "../../../../Redirect";

type Props = {};

type State = {}

class EventOfficialRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {
    return <Switch>
      <Route path={"/events/:eventId/officials/:officialId/edit"} component={(props) => <OfficialDashboardRoute eventId={_.get(props,'match.params.eventId')} officialId={_.get(props,'match.params.officialId')} />}/>
      <RedirectWithParams from={'/events/:eventId/officials/:officialId'} to={'/events/:eventId/officials/:officialId/edit'}/>
    </Switch>;
  }
}

export default EventOfficialRoute;
