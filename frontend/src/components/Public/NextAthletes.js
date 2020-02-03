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
      .flatMap(athlete => {
        const attempts = athlete.attempts
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
      .sort((a, b) => {
        const attemptA = a.attempt;
        const attemptB = b.attempt;

        const max = Number.MAX_VALUE;

        const weightA = attemptA && attemptA.weight ? attemptA.weight : max;
        const weightB = attemptB && attemptB.weight ? attemptB.weight : max;

        if (weightA === weightB) {
          return a.los - b.los;
        }

        return weightA - weightB;
      })
      .sort((a, b) => a.i - b.i);
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
          const { attempt, v } = athlete;
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
