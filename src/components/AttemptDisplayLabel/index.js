// @flow
import React, { Component } from 'react';
import _ from "lodash";
import Colors from "../../styles/colors";
import Bold from "../Bold"

type Props = {
  attempt: any,
};

type State = {

}

class AttemptDisplayLabel extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { attempt } = this.props;

    const done = _.get(attempt,'done');
    const valid = _.get(attempt,'valid');
    return <Bold style={{color: done ? valid ? Colors.success : Colors.danger : null}}>{_.get(attempt,'weight')}</Bold>

  }
}

export default AttemptDisplayLabel;
