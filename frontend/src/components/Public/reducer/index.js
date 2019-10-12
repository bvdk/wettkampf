export const ActionTypes = {
  setPublicConfig: 'SET_PUBLIC_CONFIG',
  nextAthletes: 'NEXT_ATHLETES'
};

export const getInitialState = props => ({
  ...props,
  publicConfig: {
    eventId: null
  },
  nextAthletesUpdated: new Date(),
  nextAthletes: {}
});

export const reducer = (state, action) => {
  const nextState = { ...state };
  switch (action.type) {
    case ActionTypes.setPublicConfig: {
      nextState.publicConfig = action.data;
      break;
    }
    case ActionTypes.nextAthletes: {
      nextState.nextAthletes = Object.assign(
        nextState.nextAthletes,
        action.data
      );
      nextState.nextAthletesUpdated = new Date();
      break;
    }
    default: {
      break;
    }
  }
  return nextState;
};
