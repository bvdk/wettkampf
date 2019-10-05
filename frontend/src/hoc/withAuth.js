// @flow
import React from 'react';
import { branch, renderComponent, compose } from 'recompose';
import _ from 'lodash';
import { connect } from 'react-redux';
import LoginWrapper from '../components/Login/wrapper';

const withAuth = () =>
  compose(
    connect(state => ({
      token: _.get(state, 'auth.token')
    })),
    branch(({ token }) => !token, renderComponent(() => <LoginWrapper />))
  );

export default withAuth;
