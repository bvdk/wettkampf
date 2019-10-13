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

const shortDisciplines = {
  SQUAT: 'KB',
  BENCHPRESS: 'BD',
  DEADLIFT: 'KH'
};

const EventAttempts = ({ eventId, client }) => {
  const [attemptAthletes, setAttemptAthletes] = useState([]);
  const [availableDisciplines, setAvailableDisciplines] = useState([]);
  useEffect(() => {
    getEventAttempts(client, eventId, undefined, data => {
      setAttemptAthletes(data.athletes.filter(a => a.bodyWeight !== null));
      setAvailableDisciplines(data.availableDisciplines);
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

  const renderColumns = [
    ...columns,
    ...availableDisciplines.map(availableDiscipline => ({
      dataIndex: availableDiscipline,
      title: shortDisciplines[availableDiscipline]
    }))
  ];

  const renderDisciplineAttempts = (athlete, column) =>
    athlete.attempts
      .filter(attempt => attempt.discipline === column.dataIndex)
      .sort((a, b) => b.index - a.index)
      .reverse()
      .concat([null, null, null])
      .slice(0, 3)
      .map((attempt, index) => {
        let className = '';
        if (attempt) {
          if (attempt.resign) {
            className = 'text-warning';
          } else if (attempt.done && attempt.valid) {
            className = 'text-success';
          } else if (attempt.done && !attempt.valid) {
            className = 'text-danger';
          }
        }

        return (
          <Fragment key={index}>
            {index !== 0 ? '/' : ''}
            <span className={className}>{attempt ? attempt.weight : '-'}</span>
          </Fragment>
        );
      });

  return (
    <table className="table table-hover" style={{ width: '100%' }}>
      <thead>
        <tr>
          {renderColumns.map(c => (
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
              <td colSpan={renderColumns.length}>{weightClass}</td>
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
                  {renderColumns.map((column, i) => {
                    let data = athlete[column.dataIndex];
                    switch (column.title) {
                      case 'Gewicht': {
                        data += ' kg';
                        break;
                      }
                      case 'KB':
                      case 'BD':
                      case 'KH': {
                        data = renderDisciplineAttempts(athlete, column);
                        break;
                      }
                      default: {
                        break;
                      }
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
