import React, {Component} from 'react';
import {PersistGate} from 'redux-persist/es/integration/react'
import {persistStore} from 'redux-persist';
import {Provider} from 'react-redux';
import './i18n';
import Routes from "./routes";
import {HashRouter as Router} from "react-router-dom";
import Layout from "./components/Layout";
import AuthWrapper from "./auth";
import './App.css';
import {LocaleProvider} from 'antd';
import de_DE from 'antd/lib/locale-provider/de_DE';
import moment from 'moment';
import 'moment/locale/de';

import store from './redux/store';

moment.locale('de');


class App extends Component {

    constructor(props) {
        super(props);

        this.persistor = persistStore(store, null, () => {
            console.log('persistStore', store.getState())
        });

    }

    render() {


        return (
          <PersistGate persistor={this.persistor}>
              <Provider store={store}>
                  <LocaleProvider locale={de_DE}>
                      <Layout>
                          <AuthWrapper>
                              <Router>
                                  <Routes />
                              </Router>
                          </AuthWrapper>
                      </Layout>
                  </LocaleProvider>
              </Provider>
          </PersistGate>


        );
    }
}

export default App;
