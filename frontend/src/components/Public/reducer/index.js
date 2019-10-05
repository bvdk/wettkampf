export const ActionTypes = {
  setPublicConfig: 'SET_PUBLIC_CONFIG',
  nextAthletes: 'NEXT_ATHLETES'
};

export const getInitialState = props => ({
  ...props,
  publicConfig: {
    eventId: null,
    nextAthletes: []
  }
});

export const reducer = (state, action) => {
  const nextState = { ...state };
  switch (action.type) {
    case ActionTypes.setPublicConfig: {
      nextState.publicConfig = action.data;
      break;
    }
    case ActionTypes.nextAthletes: {
      nextState.nextAthletes = action.data;
      break;
    }
    default: {
      break;
    }
  }
  return nextState;
};
