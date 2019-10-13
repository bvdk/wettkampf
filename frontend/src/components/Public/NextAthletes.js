import React from 'react';
import { Icon } from 'antd';

const NextAthletes = ({ athletes }) => {
  const athleteHelper = {};

  const thStyle = {
    position: 'sticky',
    top: -1,
    zIndex: 2,
    background: 'white',
    borderTop: 'none'
  };

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
        {athletes.map((athlete, index) => {
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

          const indexColumnValue =
            index === 0 ? <Icon type="right" /> : index + 1;

          let weight = '';
          const attempt = athlete.attempts[athleteHelper[athlete.id]];
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
              <td>{(athleteHelper[athlete.id] % 3) + 1}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default React.memo(NextAthletes);
