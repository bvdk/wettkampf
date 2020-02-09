import React, { Fragment } from 'react';

const DisciplineAttempts = props => {
  const { athlete, column } = props;
  return athlete.attempts
    .filter(attempt => attempt.discipline === column.key)
    .sort((a, b) => b.index - a.index)
    .reverse()
    .concat([null, null, null])
    .slice(0, 3)
    .map((attempt, index) => {
      if (!attempt) {
        return null;
      }

      let className = '';
      if (attempt.resign) {
        className = 'text-warning';
      } else if (attempt.done && attempt.valid) {
        className = 'text-success';
      } else if (attempt.done && !attempt.valid) {
        className = 'text-danger';
      }

      return (
        <Fragment key={attempt.id}>
          {index !== 0 ? '/' : ''}
          <span className={className}>
            {attempt.weight ? attempt.weight : '-'}
          </span>
        </Fragment>
      );
    });
};

export default React.memo(DisciplineAttempts);
