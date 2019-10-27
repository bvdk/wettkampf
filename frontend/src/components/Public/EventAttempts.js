import React, { Fragment, useEffect, useMemo, useState } from 'react';
import getEventAttempts from '../../actions/getEventAttempts';
import DisciplineAttempts from './DisciplineAttempts';

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
    dataIndex: 'los',
    title: 'Losnummer'
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

const EventAttempts = ({ eventId, client, athleteGroups }) => {
  const [{ allAttemptAthletes, availableDisciplines }, setData] = useState({
    allAttemptAthletes: [],
    availableDisciplines: []
  });

  useEffect(() => {
    if (eventId) {
      getEventAttempts(client, eventId, data => {
        setData({
          allAttemptAthletes: data.athletes.filter(a => a.bodyWeight !== null),
          availableDisciplines: data.availableDisciplines
        });
      });
    }
  }, [client, eventId]);

  const attemptAthletes = useMemo(
    () =>
      allAttemptAthletes.filter(a => athleteGroups.includes(a.athleteGroupId)),
    [allAttemptAthletes, athleteGroups]
  );

  const weightClasses = useMemo(
    () => [...new Set(attemptAthletes.map(a => a.resultClass.name))],
    [attemptAthletes]
  );
  const weightClassesAthletes = useMemo(
    () =>
      weightClasses.map(weightClass =>
        attemptAthletes.filter(a => a.resultClass.name === weightClass)
      ),
    [weightClasses, attemptAthletes]
  );

  const renderColumns = useMemo(
    () => [
      ...columns,
      ...availableDisciplines.map(availableDiscipline => ({
        dataIndex: availableDiscipline,
        title: shortDisciplines[availableDiscipline]
      }))
    ],
    [availableDisciplines]
  );

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
                        data = (
                          <DisciplineAttempts
                            athlete={athlete}
                            column={column}
                          />
                        );
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
