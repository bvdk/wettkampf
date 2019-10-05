import React, { Component } from 'react';
import { PersistGate } from 'redux-persist/es/integration/react';
import { persistStore } from 'redux-persist';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import german from 'antd/lib/locale-provider/de_DE';
import moment from 'moment';
import 'moment/locale/de';
import { Route, Switch } from 'react-router';
import { get } from 'lodash';

import './i18n';
import './App.css';
import AuthWrapper from './auth';
import Layout from './components/Layout';
import store from './redux/store';

import EventRoute from './components/Event';
import EventsDashboardRoute from './components/Events/DashboardRoute';
import PublicDashboardRoute from './components/Public/PublicDashboardRoute';
import EventResultsRoute from './components/Event/ResultsRoute';
import Redirect from './Redirect';

moment.locale('de');

const Routes = () => (
  <Switch>
    <Route path="/public" component={PublicDashboardRoute} />
    <Route
      path="/"
      component={() => (
        <Layout>
          <Switch>
            <Route path="/events/:eventId/:index" component={EventRoute} />
            <Route path="/events/:eventId" component={EventRoute} />
            <Route path="/events" component={EventsDashboardRoute} />
            <Route
              path="/fullscreen/events/:eventId/results"
              component={props => (
                <EventResultsRoute
                  isFullscreen={true}
                  history={get(props, 'history')}
                  eventId={props.match.params.eventId}
                />
              )}
            />
            <Redirect path="/" to="/events" />
          </Switch>
        </Layout>
      )}
    />
  </Switch>
);

class App extends Component {
  constructor(props) {
    super(props);

    this.persistor = persistStore(store, null, () => {
      console.warn('persistStore', store.getState());
    });
  }

  render() {
    return (
      <PersistGate persistor={this.persistor}>
        <Provider store={store}>
          <LocaleProvider locale={german}>
            <AuthWrapper>
              <Router>
                <Routes />
              </Router>
            </AuthWrapper>
          </LocaleProvider>
        </Provider>
      </PersistGate>
    );
  }
}

export default App;
