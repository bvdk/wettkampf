// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import {ApolloProvider} from "react-apollo";
import {InMemoryCache} from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { createHttpLink } from 'apollo-link-http';
import Routes from "../routes";
import {HashRouter as Router} from "react-router-dom";
import {connect} from "react-redux";
import LoginWrapper from "../components/Login/wrapper";
import withAuth from "../hoc/withAuth";

type Props = {

};

type State = {

}


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



class AuthWrapper extends Component<Props, State> {
  componentDidMount() {}

  render() {

    const cache = new InMemoryCache();

    const link = createHttpLink({
      uri: "/graphql",
      headers: {
        Authorization: `bearer ${this.props.token}`
      }
    });

    const client = new ApolloClient({
      link,
      cache
    });
    client.defaultOptions = defaultOptions;

    return <ApolloProvider
      client={client}>
      <Router>
        <Routes />
      </Router>
    </ApolloProvider>  ;
  }
}

export default withAuth()(AuthWrapper);
