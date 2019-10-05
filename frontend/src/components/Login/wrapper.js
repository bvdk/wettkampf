// @flow
import React from 'react';
import Panel from '../Panel';
import Login from './index';

import './wrapper.css';

const LoginWrapper = () => (
  <div
    className={'login-wrapper'}
    style={{ marginTop: 100, textAlign: 'center' }}>
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <Panel>
        <Login />
      </Panel>
    </div>
  </div>
);

export default LoginWrapper;
