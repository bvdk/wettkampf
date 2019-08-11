import _ from "lodash";
import * as actionTypes from '../actions/actionTypes';

const initialState = {

};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_SETTING:
      const tmp = {...state}
      _.set(tmp,action.path,action.value);
      return tmp;
    default:
      return state;
  }
};

export default reducer;
