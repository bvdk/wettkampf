// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import Colors from '../../styles/colors';
import Bold from '../Bold';

type Props = {
  attempt: any
};

class AttemptDisplayLabel extends Component<Props, {}> {
  render() {
    const { attempt } = this.props;

    const done = _.get(attempt, 'done');
    const valid = _.get(attempt, 'valid');
    const resign = _.get(attempt, 'resign');

    let color = null;
    if (resign) {
      color = Colors.warning;
    } else if (done) {
      if (valid) {
        color = Colors.success;
      } else {
        color = Colors.danger;
      }
    }

    return (
      <Bold
        style={{
          color
        }}>
        {_.get(attempt, 'weight')}
      </Bold>
    );
  }
}

export default AttemptDisplayLabel;
