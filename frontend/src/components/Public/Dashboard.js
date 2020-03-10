// @flow
import React, { useEffect, useReducer } from 'react';
import _ from 'lodash';
import subscribePublicConfig from '../../actions/subscribePublicConfig';
import { setPublicConfig, getInitialState, reducer } from './reducer';
import subscribeUpdateNextAthletes from '../../actions/subscribeUpdateNextAthletes';
import NextAthletes, { sortAthletes } from './NextAthletes';
import EventAttempts from './EventAttempts';

type DashboardProps = {
  client: any
};

const Dashboard = (props: DashboardProps) => {
  const initialState = getInitialState(props);
  const [
    { client, nextAthletes, disciplines, athleteGroups, publicConfig },
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
    const groupedAthletes = _.groupBy(nextAthletes, 'athleteGroupId');

    const athleteHelper = {};
    const athletesData = athleteGroups.flatMap(id => {
      if (!groupedAthletes[id]) {
        return [];
      }
      return groupedAthletes[id]
        .flatMap(athlete => {
          const attempts = athlete.attempts
            .filter(a => a.discipline === publicConfig.discipline && a.weight)
            .map((a, i) => ({ ...a, i }))
            .filter(a => !a.done);
          if (athleteHelper[athlete.id] === undefined) {
            athleteHelper[athlete.id] = 0;
          } else {
            athleteHelper[athlete.id] += 1;
          }

          const attempt = attempts[athleteHelper[athlete.id]];

          if (attempt && attempt.done) {
            return undefined;
          }

          return attempts.map(a => ({
            ...athlete,
            attempts,
            attempt: a,
            v: (a.i % 3) + 1,
            i: a.i
          }));
        })
        .filter(e => e)
        .sort(sortAthletes)
        .sort((a, b) => a.i - b.i);
    });

    const nextAthleteId = athletesData[0].id;
    return (
      <div className="row no-gutters">
        <div className="col-9">
          <EventAttempts
            athleteGroups={athleteGroups}
            athletes={nextAthletes}
            nextAthleteId={nextAthleteId}
            disciplines={disciplines}
          />
        </div>
        <div className="col-3">
          <NextAthletes athletesData={athletesData} />
        </div>
      </div>
    );
  }
  return <div>Warte auf die Auswahl der aktuellen Veranstaltung</div>;
};

export default React.memo(Dashboard);
