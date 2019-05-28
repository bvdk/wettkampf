import * as actionTypes from './actionTypes';

export const setSetting = (path, value) => ({
  type: actionTypes.SET_SETTING,
  path,
  value,
});

