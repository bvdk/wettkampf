import { ApolloClient, InMemoryCache } from 'apollo-client-preset';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';

import { logout } from '../redux/actions/auth';

export default (token, dispatch) => {
  const fragmentMatcher = new IntrospectionFragmentMatcher({});

  const cache = new InMemoryCache({
    fragmentMatcher
  });

  const httpLink = createHttpLink({ uri: '/api/graphql' });
  const wsLink = new WebSocketLink({
    uri: `ws://${window.location.hostname}/`,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: token ? `bearer ${token}` : null
      }
    }
  });

  const connectionLink = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  const middlewareLink = setContext(() => ({
    headers: {
      authorization: token ? `bearer ${token}` : null
    }
  }));

  const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (networkError && networkError.statusCode === 401) {
      dispatch(logout());
    }
  });

  const link = middlewareLink.concat(errorLink).concat(connectionLink);

  return new ApolloClient({
    link,
    cache
  });
};
