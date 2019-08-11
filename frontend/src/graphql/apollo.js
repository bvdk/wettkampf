import {ApolloClient, InMemoryCache} from 'apollo-client-preset';
import {IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {onError} from 'apollo-link-error';

import {logout} from "../redux/actions/auth";

// const networkInterface = createNetworkInterface({
//   uri: process.env.REACT_APP_GRAPHQL_URI || '/graphql',
//   opts: {
//     credentials: 'same-origin',
//   },
// });


export default (token, dispatch) => {

    const fragmentMatcher = new IntrospectionFragmentMatcher({});

    let cache = new InMemoryCache({
        fragmentMatcher,
    });

    const httpLink = createHttpLink({uri: '/graphql' });

    const middlewareLink = setContext(() => ({
        headers: {
            authorization: token ? `bearer ${token}` : null,
        }
    }));

    const errorLink = onError(({networkError, graphQLErrors}) => {
        if (networkError && networkError.statusCode === 401) {
            dispatch(logout())
        }
    });


    const link = middlewareLink.concat(errorLink).concat(httpLink);

    const client = new ApolloClient({
        link,
        cache
    });

    return client;
};
