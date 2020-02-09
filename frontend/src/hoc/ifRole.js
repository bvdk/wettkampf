import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Error from '../components/Error';

type Props = {
  showError?: boolean,
  role?: string
};

type State = {};

class IfRole extends React.Component<Props, State> {
  static defaultProps = {
    role: 'admin'
  };

  render() {
    const { user, showError } = this.props;

    if (user.role !== this.props.role) {
      if (showError) {
        return (
          <Error
            title={'Kein Zugriff'}
            description={
              'Sie haben haben nicht die benötigten Berechtigungen auf diese Seite zuzugreifen.'
            }
          />
        );
      }

      return null;
    }

    return this.props.children;
  }
}

export default connect(state => ({
  user: _.get(state, 'auth.user')
}))(IfRole);
