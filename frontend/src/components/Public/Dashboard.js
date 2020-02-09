// @flow
import React, { useEffect, useReducer } from 'react';
import subscribePublicConfig from '../../actions/subscribePublicConfig';
import { setPublicConfig, getInitialState, reducer } from './reducer';
import subscribeUpdateNextAthletes from '../../actions/subscribeUpdateNextAthletes';
import NextAthletes from './NextAthletes';
import EventAttempts from './EventAttempts';

type DashboardProps = {
  client: any
};

const Dashboard = (props: DashboardProps) => {
  const initialState = getInitialState(props);
  const [
    { client, nextAthletes, disciplines, athleteGroups },
    dispatch
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    const dispatchData = data => dispatch({ type: setPublicConfig, data });

    const subscriptions = [
      subscribePublicConfig(client, dispatchData),
      subscribeUpdateNextAthletes(client, dispatchData)
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, [client]);

  if (nextAthletes.length) {
    return (
      <div className="row no-gutters">
        <div className="col-9">
          <EventAttempts
            athleteGroups={athleteGroups}
            athletes={nextAthletes}
            disciplines={disciplines}
          />
        </div>
        <div className="col-3">
          <NextAthletes athleteGroups={athleteGroups} athletes={nextAthletes} />
        </div>
      </div>
    );
  }
  return <div>Warte auf die Auswahl der aktuellen Veranstaltung</div>;
};

export default React.memo(Dashboard);
