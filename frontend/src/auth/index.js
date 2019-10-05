// @flow
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import withAuth from '../hoc/withAuth';
import getClient from '../graphql/apollo';

const AuthWrapper = ({ token, dispatch, children }) => (
  <ApolloProvider client={getClient(token, dispatch)}>
    {children}
  </ApolloProvider>
);

export default withAuth()(AuthWrapper);
