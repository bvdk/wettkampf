import React from 'react';
import {branch, compose, renderComponent} from 'recompose';
import _ from 'lodash';
import Loader from '../components/Loader';
import ErrorComponent from '../components/Error';

const waitWhileLoading = (propName = 'data', keys: string[], options) =>
  compose(
    branch(
      (props) => !_.get(options,'optional',false) && (!props || !props[propName]),
      renderComponent(() => (<ErrorComponent title={'No query'}/>)),
    ),
    branch(
      (props) => _.has(props, propName) && (props[propName].loading || props[propName].pending ),
      renderComponent(() => <Loader size={_.get(options,'loaderSize')} loading />),
    ),
    branch(
      (props) => props[propName] && (props[propName].error || props[propName].rejected),
      renderComponent((props) => {
        const error = _.get(props, `${[propName]}.error`);
        if (_.has(error, 'graphQLErrors')) {

            return <ErrorComponent title={'GraphQL API Error'}
                                   error={error}
                                   description={_.first(error.graphQLErrors.map(({message, debugMessage}, i) => (
                                       <div><span key={i}>{message}{debugMessage ? `: ${debugMessage}` : ''}</span>
                                       </div>
                                   )))}/>;
        } else if (_.has(error, 'networkError')) {
          return <ErrorComponent title={'Network Error'} description={error.networkError}/>;
        }
        console.error(props[propName].error);
        return <ErrorComponent title={'Query error'}/>;
      }),
    ),
    branch(
      (props) => {
        if (_.isString(keys)){
          keys = [keys];
        }
        return props[propName] && keys && keys.reduce((acc, cur) => (acc || !_.has(props[propName], cur)), false)
      },
      renderComponent((props)=>{
          console.error('Keys not found',keys,props[propName]);
          return <ErrorComponent title={`Keys not found`} description={`${keys} could not be found`}/>;
      }),
    ),
  );

export default waitWhileLoading;
