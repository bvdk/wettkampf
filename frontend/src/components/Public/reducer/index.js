export const setPublicConfig = 'SET_PUBLIC_CONFIG';

export const getInitialState = props => ({
  ...props,
  publicConfig: {
    event: {}
  },
  athleteGroups: [],
  nextAthletes: [],
  disciplines: []
});

const shortDisciplines = {
  SQUAT: 'KB',
  BENCHPRESS: 'BD',
  DEADLIFT: 'KH'
};

export const reducer = (state, action) => {
  const nextState = { ...state };
  switch (action.type) {
    case setPublicConfig: {
      const { athleteGroups, event, nextAthletes } = action.data;
      const { availableDisciplines } = event;
      nextState.publicConfig = action.data;
      nextState.athleteGroups = athleteGroups.map(ag => ag.id);
      nextState.disciplines = availableDisciplines.map(availableDiscipline => ({
        key: availableDiscipline,
        label: shortDisciplines[availableDiscipline]
      }));
      nextState.nextAthletes = nextAthletes.map(item => ({
        ...item,
        attempts: availableDisciplines.flatMap(discipline =>
          item.attempts.filter(a => a.discipline === discipline)
        )
      }));
      break;
    }
    default: {
      break;
    }
  }
  return nextState;
};
