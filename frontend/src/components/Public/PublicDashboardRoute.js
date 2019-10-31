// @flow
import React, { useEffect, useReducer } from 'react';
import { Route, Switch } from 'react-router';
import { withApollo } from 'react-apollo';
import { usePrevious } from 'react-use';
import Redirect from '../../Redirect';
import subscribePublicConfig from '../../actions/subscribePublicConfig';
import { ActionTypes, getInitialState, reducer } from './reducer';
import subscribeUpdateNextAthletes from '../../actions/subscribeUpdateNextAthletes';
import subscribeSlotGroupChangedNotification from '../../actions/subscribeSlotGroupChangedNotification';
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
    const { client, athleteGroups, publicConfig } = state;
    const { eventId } = publicConfig;
    subscribePublicConfig(client, data =>
      dispatch({ type: ActionTypes.setPublicConfig, data })
    );
    subscribeUpdateNextAthletes(client, athleteGroups, data =>
      dispatch({
        type: ActionTypes.nextAthletes,
        data
      })
    );
    subscribeSlotGroupChangedNotification(client, data => {
      if (eventId) {
        getEventSlots(client, eventId, event => {
          if (event.slots.length) {
            event.slots.forEach(({ id }) => {
              getNextSlotAthletes(client, id, athleteGroups, slot =>
                dispatch({
                  type: ActionTypes.nextAthletes,
                  data: {
                    [id]: slot.nextAthletes
                  }
                })
              );
            });
          }
        });
      }

      dispatch({
        type: ActionTypes.nextAthleteGroups,
        data
      });
    });
  }, [
    state.client,
    state.athleteGroups,
    dispatch,
    state.publicConfig.eventId,
    state.publicConfig,
    state
  ]);

  useEffect(() => {
    const { eventId } = state.publicConfig;
    if (prevState) {
      const { eventId: prevEventId } = prevState.publicConfig;
      if (eventId && prevEventId !== eventId) {
        getEventSlots(state.client, eventId, event => {
          if (event.slots.length) {
            event.slots.forEach(({ id }) => {
              getNextSlotAthletes(state.client, id, state.athleteGroups, slot =>
                dispatch({
                  type: ActionTypes.nextAthletes,
                  data: {
                    [id]: slot.nextAthletes
                  }
                })
              );
            });
          }
        });
      }
    }
  }, [prevState, state.athleteGroups, state.client, state.publicConfig]);

  const nextAthletesEntries = Object.entries(state.nextAthletes);
  if (nextAthletesEntries.length) {
    return (
      <div className="row no-gutters">
        <div className="col-9">
          <EventAttempts
            key={state.nextAthletesUpdated}
            client={state.client}
            eventId={state.publicConfig.eventId}
            athleteGroups={state.athleteGroups}
          />
        </div>
        <div className="col-3">
          <NextAthletes
            key={state.nextAthletesUpdated}
            athletes={nextAthletesEntries[0][1]}
            athleteGroups={state.athleteGroups}
          />
        </div>
      </div>
    );
  }
  return <div>Warte auf die Auswahl der aktuellen Veranstaltung</div>;
};

const PublicDashboardRoute = () => (
  <Switch>
    <Route path="/public/dashboard" component={withApollo(Dashboard)} />
    <Redirect exact from="/public" to="/public/dashboard" />
  </Switch>
);

export default React.memo(PublicDashboardRoute);
