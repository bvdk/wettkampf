import * as actionTypes from '../actions/actionTypes';

const initialState = {
  user: null,
  token: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_LOGGED_IN:
      return {
        user: action.user,
        token: action.token
      };
    case actionTypes.USER_LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
