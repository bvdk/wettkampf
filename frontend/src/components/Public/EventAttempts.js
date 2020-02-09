import React, { Fragment, useMemo } from 'react';
import DisciplineAttempts from './DisciplineAttempts';

const columns = [
  {
    key: 'place',
    label: 'Pl'
  },
  {
    key: 'name',
    label: 'Name'
  },
  {
    key: 'bodyWeight',
    label: 'Gewicht'
  },
  {
    key: 'los',
    label: 'Losnummer'
  },
  {
    key: 'total',
    label: 'Total'
  },
  {
    key: 'points',
    label: 'Punkte'
  }
];

const thStyle = {
  position: 'sticky',
  top: -1,
  zIndex: 2,
  background: 'white',
  borderTop: 'none'
};

const EventAttempts = ({ athleteGroups, athletes, disciplines }) => {
  const attemptAthletes = useMemo(
    () => athletes.filter(a => athleteGroups.includes(a.athleteGroupId)),
    [athleteGroups, athletes]
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

  const renderColumns = [...columns, ...disciplines];

  return (
    <table className="table table-hover" style={{ width: '100%' }}>
      <thead>
        <tr>
          {renderColumns.map(({ label }) => (
            <th scope="col" key={label} style={thStyle}>
              {label}
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
                    let data = athlete[column.key];
                    switch (column.label) {
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
