// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { compose } from 'react-apollo';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Button, Divider } from 'antd';
import logo from '../../assets/Logo_BVDK.jpg';
import LoginFormConfig from './form';
import { login } from '../../redux/actions/auth';
import RemoteForm from '../Form/remote-form';
import { toastError } from '../../utils/toast';

type Props = {
  loginMutation: Function,
  t: Function,
  setLogin: Function
};

class Login extends Component<Props> {
  onGuestLogin = () => {
    this.onSubmit({
      username: 'guest',
      password: 'guest'
    }).catch(toastError);
  };

  onSubmit(values) {
    const { t, setLogin } = this.props;

    return fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
      .then(response => response.json())
      .then(res => {
        const token = _.get(res, 'token');
        const user = _.get(res, 'user');
        if (token && user) {
          setLogin({ token, user });
          return {
            message: t('Login war erfolgreich')
          };
        }
        throw new Error('Logindaten konnten nicht gespeichert werden');
      });
  }

  render() {
    return (
      <div className="form login">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <img className="logo" alt="logo" src={logo} />
        </div>
        <RemoteForm
          onSubmit={this.onSubmit}
          submitTitle="Login"
          fullWidthSubmit
          formConfig={LoginFormConfig}
          submitFormItemLayout={{
            wrapperCol: { span: 24, offset: 0 }
          }}
          useSubmit
        />
        <Divider>oder</Divider>
        <Button onClick={this.onGuestLogin} type="outline">
          Als Gast fortfahren
        </Button>
      </div>
    );
  }
}

export default compose(
  connect(
    null,
    dispatch => ({
      setLogin: ({ user, token }) => dispatch(login({ user, token }))
    })
  ),
  translate('translations')
)(Login);
