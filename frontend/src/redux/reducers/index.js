import {persistCombineReducers} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import auth from './auth';
import settings from "./settings";

const config = {
    key: 'primary',
    storage,
    blacklist: [],
};
const reducers = persistCombineReducers(config, {
    auth,
    settings
});

export default reducers;
