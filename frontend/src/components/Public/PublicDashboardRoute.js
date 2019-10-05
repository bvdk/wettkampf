// @flow
import React, { useEffect, useReducer } from 'react';
import { Route, Switch } from 'react-router';
import { withApollo } from 'react-apollo';
import { usePrevious } from 'react-use';
import Redirect from '../../Redirect';
import subscribePublicConfig from '../../actions/subscribePublicConfig';
import { ActionTypes, getInitialState, reducer } from './reducer';
import subscribeUpdateNextAthletes from '../../actions/subscribeUpdateNextAthletes';

type DasboardProps = {
  client: any
};

const Dashboard = (props: DasboardProps) => {
  const initialState = getInitialState(props);
  const [state, dispatch] = useReducer(reducer, initialState);
  const prevState = usePrevious(state);

  useEffect(() => {
    const { eventId } = state.publicConfig;
    if (prevState) {
      const { eventId: prevEventId } = prevState.publicConfig;
      if (prevEventId !== eventId) {
      }
    } else {
    }
  }, [prevState, state.publicConfig]);

  useEffect(() => {
    subscribePublicConfig(state.client, publicConfig =>
      dispatch({ type: ActionTypes.setPublicConfig, data: publicConfig })
    );
    subscribeUpdateNextAthletes(state.client, slot => {
      dispatch({ type: ActionTypes.nextAthletes, data: slot.nextAthletes });
    });
  }, [state.client, dispatch]);

  return <div>Dashboard</div>;
};

const PublicDashboardRoute = () => {
  return (
    <Switch>
      <Route path="/public/dashboard" component={withApollo(Dashboard)} />
      <Redirect exact from="/public" to="/public/dashboard" />
    </Switch>
  );
};

export default PublicDashboardRoute;
