// @flow
import React, { useEffect, useReducer } from 'react';
import { Route, Switch } from 'react-router';
import { withApollo } from 'react-apollo';
import { usePrevious } from 'react-use';
import Redirect from '../../Redirect';
import subscribePublicConfig from '../../actions/subscribePublicConfig';
import { ActionTypes, getInitialState, reducer } from './reducer';
import subscribeUpdateNextAthletes from '../../actions/subscribeUpdateNextAthletes';
import getNextSlotAthletes from '../../actions/getNextSlotAthletes';
import getEventSlots from '../../actions/getEventSlots';
import NextAthletes from './NextAthletes';
import EventAttempts from './EventAttempts';

type DasboardProps = {
  client: any
};

const Dashboard = (props: DasboardProps) => {
  const initialState = getInitialState(props);
  const [state, dispatch] = useReducer(reducer, initialState);
  const prevState = usePrevious(state);

  useEffect(() => {
    subscribePublicConfig(state.client, publicConfig =>
      dispatch({ type: ActionTypes.setPublicConfig, data: publicConfig })
    );
    subscribeUpdateNextAthletes(state.client, data => {
      dispatch({
        type: ActionTypes.nextAthletes,
        data
      });
    });
  }, [state.client, dispatch]);

  useEffect(() => {
    const { eventId } = state.publicConfig;
    if (prevState) {
      const { eventId: prevEventId } = prevState.publicConfig;
      if (prevEventId !== eventId) {
        getEventSlots(state.client, eventId, event => {
          if (event.slots.length) {
            event.slots.forEach(({ id }) => {
              getNextSlotAthletes(state.client, id, slot => {
                dispatch({
                  type: ActionTypes.nextAthletes,
                  data: {
                    [id]: slot.nextAthletes
                  }
                });
              });
            });
          }
        });
      }
    }
  }, [prevState, state.client, state.publicConfig]);

  const nextAthletesEntries = Object.entries(state.nextAthletes);
  if (nextAthletesEntries.length) {
    return (
      <div className="row no-gutters">
        <div className="col-9">
          <EventAttempts
            key={state.nextAthletesUpdated}
            client={state.client}
            eventId={state.publicConfig.eventId}
          />
        </div>
        <div className="col-3">
          <NextAthletes
            key={state.nextAthletesUpdated}
            athletes={nextAthletesEntries[0][1].slice(0, 25)}
          />
        </div>
      </div>
    );
  }
  return <div>Warte auf die Auswahl der aktuellen Veranstaltung</div>;
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
