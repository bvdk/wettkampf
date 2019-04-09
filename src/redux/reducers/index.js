import { combineReducers } from 'redux';
import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import auth from './auth';

const config = {
  key: 'primary',
  storage,
  blacklist: [],
};
const reducers = persistCombineReducers(config, {
  auth
});

export default reducers;
