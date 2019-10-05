import * as actionTypes from './actionTypes';

export const login = ({ user, token }) => ({
  type: actionTypes.USER_LOGGED_IN,
  user,
  token
});

export function logout() {
  return {
    type: actionTypes.USER_LOGGED_OUT
  };
}
