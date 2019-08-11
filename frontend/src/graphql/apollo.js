import {ApolloClient, InMemoryCache} from 'apollo-client-preset';
import {IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {onError} from 'apollo-link-error';

import {logout} from "../redux/actions/auth";

export default (token, dispatch) => {
    const fragmentMatcher = new IntrospectionFragmentMatcher({});

    const cache = new InMemoryCache({
        fragmentMatcher
    });

    const httpLink = createHttpLink({uri: '/api/graphql' });

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

    return new ApolloClient({
        link,
        cache
    });
};
