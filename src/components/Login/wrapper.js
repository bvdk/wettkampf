// @flow
import React, { Component } from 'react';
import {Row, Col} from "antd";
import Panel from "./../Panel";
import Login from "./index";


import "./wrapper.css";

type Props = {

};

type State = {

}

class LoginWrapper extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const {  } = this.props;

    return <div className={"login-wrapper"} style={{marginTop: 100, textAlign: 'center'}}>

      <div style={{maxWidth: 400, margin: '0 auto'}}>
        <Panel>
          <Login />
        </Panel>
      </div>
    </div>;
  }
}

export default LoginWrapper;
