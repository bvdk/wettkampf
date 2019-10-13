import React, { Fragment, useEffect, useState } from 'react';
import getEventAttempts from '../../actions/getEventAttempts';

const columns = [
  {
    dataIndex: 'place',
    title: 'Pl'
  },
  {
    dataIndex: 'name',
    title: 'Name'
  },
  {
    dataIndex: 'bodyWeight',
    title: 'Gewicht'
  },
  {
    dataIndex: 'total',
    title: 'Total'
  },
  {
    dataIndex: 'points',
    title: 'Punkte'
  }
];

const EventAttempts = ({ eventId, client }) => {
  const [attemptAthletes, setAttemptAthletes] = useState([]);
  useEffect(() => {
    getEventAttempts(client, eventId, undefined, data => {
      setAttemptAthletes(data.athletes.filter(a => a.bodyWeight !== null));
    });
  }, [client, eventId]);

  const thStyle = {
    position: 'sticky',
    top: -1,
    zIndex: 2,
    background: 'white',
    borderTop: 'none'
  };

  const weightClasses = [
    ...new Set(attemptAthletes.map(a => a.resultClass.name))
  ];
  const weightClassesAthletes = weightClasses.map(weightClass =>
    attemptAthletes.filter(a => a.resultClass.name === weightClass)
  );

  return (
    <table className="table table-hover" style={{ width: '100%' }}>
      <thead>
        <tr>
          {columns.map(c => (
            <th scope="col" key={c.title} style={thStyle}>
              {c.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weightClasses.map((weightClass, index) => (
          <Fragment key={weightClass}>
            <tr className="table-sm bg-secondary text-white">
              <td colSpan={columns.length}>{weightClass}</td>
            </tr>
            {weightClassesAthletes[index]
              .sort((a, b) => {
                const placeA = a.place;
                const placeB = b.place;
                if (placeA && placeB) {
                  return placeB - placeA;
                }
                if (!placeA && !placeB) {
                  return 0;
                }
                if (!placeA) {
                  return -1;
                }
                if (!placeB) {
                  return 1;
                }
                return 0;
              })
              .reverse()
              .map(athlete => (
                <tr key={athlete.id} className="table-sm">
                  {columns.map((column, i) => {
                    let data = athlete[column.dataIndex];
                    if (column.title === 'Gewicht') {
                      data += ' kg';
                    }
                    return <td key={i}>{data}</td>;
                  })}
                </tr>
              ))}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default React.memo(EventAttempts);
