// @flow
import React, { Component } from 'react';
import {ApolloProvider} from "react-apollo";
import withAuth from "../hoc/withAuth";
import getClient from "./../graphql/apollo";

type Props = {};

type State = {};

// const defaultOptions = {
//   watchQuery: {
//     fetchPolicy: 'cache-and-network',
//     errorPolicy: 'ignore',
//   },
//   query: {
//     fetchPolicy: 'cache-and-network',
//     errorPolicy: 'all',
//   },
//   mutate: {
//     errorPolicy: 'all'
//   }
// }

class AuthWrapper extends Component<Props, State> {
  render() {
    const client = getClient(this.props.token, this.props.dispatch)

    return <ApolloProvider
      client={client}>
      { this.props.children }
    </ApolloProvider>  ;
  }
}

export default withAuth()(AuthWrapper);
