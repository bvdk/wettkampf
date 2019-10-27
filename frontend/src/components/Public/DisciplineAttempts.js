import React, { Fragment } from 'react';

const DisciplineAttempts = props => {
  const { athlete, column } = props;
  return athlete.attempts
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
        <Fragment key={attempt ? attempt.id : index}>
          {index !== 0 ? '/' : ''}
          <span className={className}>{attempt ? attempt.weight : '-'}</span>
        </Fragment>
      );
    });
};

export default React.memo(DisciplineAttempts);
