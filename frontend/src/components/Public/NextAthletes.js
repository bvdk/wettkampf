import React from 'react';
import { Icon } from 'antd';
import _ from 'lodash';

const NextAthletes = ({ athletes, athleteGroups }) => {
  const thStyle = {
    position: 'sticky',
    top: -1,
    zIndex: 2,
    background: 'white',
    borderTop: 'none'
  };

  const groupedAthletes = _.groupBy(athletes, 'athleteGroupId');

  const athleteHelper = {};
  const athletesData = athleteGroups.flatMap(id => {
    if (!groupedAthletes[id]) {
      return [];
    }
    return groupedAthletes[id]
      .map(athlete => {
        const actualAttempt = athlete.attempts[athlete.attempts.length - 1];

        if (athleteHelper[athlete.id] === undefined) {
          if (actualAttempt) {
            athleteHelper[athlete.id] = actualAttempt.index;
          } else {
            athleteHelper[athlete.id] = 0;
          }
        } else {
          athleteHelper[athlete.id] += 1;
        }

        const v = (athleteHelper[athlete.id] % 3) + 1;
        const attempt = athlete.attempts[v - 1];
        if (attempt && attempt.done) {
          return undefined;
        }

        return {
          ...athlete,
          attempt,
          v
        };
      })
      .filter(e => e)
      .sort((a, b) => {
        const max = Number.MAX_VALUE;
        const attemptA = a.attempts[a.v - 1];
        const attemptB = b.attempts[b.v - 1];
        const weightA = attemptA ? attemptA.weight : max;
        const weightB = attemptB ? attemptB.weight : max;

        if (weightA === weightB) {
          return a.los - b.los;
        }

        return weightA - weightB;
      })
      .sort((a, b) => a.v - b.v);
  });

  return (
    <table className="table table-hover" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th scope="col" style={thStyle}>
            #
          </th>
          <th scope="col" style={thStyle}>
            Name
          </th>
          <th scope="col" style={thStyle}>
            Gewicht
          </th>
          <th scope="col" style={thStyle}>
            V.
          </th>
        </tr>
      </thead>
      <tbody>
        {athletesData.slice(0, 25).map((athlete, index) => {
          const { v } = athlete;
          const attempt = athlete.attempts[v - 1];
          const indexColumnValue =
            index === 0 ? <Icon type="right" /> : index + 1;

          let weight = '';
          if (attempt) {
            if (attempt.weight) {
              weight = `${attempt.weight} kg`;
            }
          }

          return (
            <tr key={index} className="table-sm">
              <td>{indexColumnValue}</td>
              <td>{athlete.name}</td>
              <td>{weight}</td>
              <td>{v}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default React.memo(NextAthletes);
