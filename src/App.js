import React, {Component} from 'react';
import ApolloClient from "apollo-boost";
import {ApolloProvider} from "react-apollo";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

import './i18n';
import Routes from "./routes";
import {HashRouter as Router} from "react-router-dom";
import Layout from "./components/Layout";
import './App.css';
import { LocaleProvider } from 'antd';
import de_DE from 'antd/lib/locale-provider/de_DE';
import moment from 'moment';
import 'moment/locale/de';

moment.locale('de');

const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
    },
    mutate: {
        errorPolicy: 'all'
    }
}

const cache = new InMemoryCache();

const client = new ApolloClient({
    uri: "/graphql",
    link: new HttpLink(),
    cache
});
client.defaultOptions = defaultOptions;

class App extends Component {
    render() {


        return (
            <LocaleProvider locale={de_DE}>
                <ApolloProvider
                    client={client}>
                    <Router>
                        <Layout>
                            <Routes />
                        </Layout>
                    </Router>
                </ApolloProvider>
            </LocaleProvider>

        );
    }
}

export default App;
