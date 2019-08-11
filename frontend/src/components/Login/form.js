// @flow
/*
field:
- title
- type: text | textarea | datetime | boolean | select
- placeholder
- isRequired
- validators
 */
import React from "react";
import rules from "../Form/rules";

import {Icon} from "antd";

const formItemLayout = {
  labelCol: {
    md: { span: 0 },
  },
  wrapperCol: {
    md: {
      span: 24,
        offset: 0,
    },
  },
};

const LoginFormConfig = {
  formName: "LoginForm",
  fields:{
    username: {
      placeholder: 'Username',
      rules: [
        rules.required
      ],
      type: 'text',
      formItemLayout,
      inputOptions: {
        prefix: <Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>,
        size: 'large'
      }
    },
    password: {
      placeholder: 'Password',
      type: 'password',
      rules: [
        rules.required
      ],
      formItemLayout,
      inputOptions: {
        prefix: <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />,
        size: 'large'
      }

    }
  }
};

export default LoginFormConfig;
