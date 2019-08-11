// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import {compose} from "recompose";
import {logout} from "../../redux/actions/auth";
import {connect} from "react-redux";
import {Button} from "antd";


type Props = {

};

type State = {

}

class LogoutButton extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { localLogout, token } = this.props;

    return token ? <Button style={{marginLeft: 8}} type="primary" size={'small'} ghost onClick={()=> this.props.localLogout()}>Logout</Button> : null
  }
}

export default compose(
  connect((state)=>{
    return {
      token: _.get(state,'auth.token')
    }
  }, (dispatch) => ({
    localLogout: () => dispatch(logout())
  }))
)(LogoutButton);
