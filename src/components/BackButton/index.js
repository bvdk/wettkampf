// @flow
import React, { Component } from 'react';
import {withRouter} from "react-router";
import {Button, Icon} from "antd";

type Props = {
  history?: any,
};

type State = {

}

class BackButton extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { history } = this.props;

    return <Button icon={'left'} onClick={()=> history.goBack()}>Zurück</Button>;
  }
}

export default withRouter(BackButton);
