import { compose, createStore } from 'redux';

import rootReducer from '../reducers';

const enhancers = [];

if (process.env.NODE_ENV === 'development') {
  // middleware.push(logger);

  const { devToolsExtension } = window;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(...enhancers);

const store = createStore(rootReducer, undefined, composedEnhancers);

export default store;
