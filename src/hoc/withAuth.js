import React from 'react';
import { branch, renderComponent, compose } from 'recompose';
import _ from 'lodash';
import {connect} from "react-redux";
import LoginWrapper from "./../components/Login/wrapper";

function mapStateToProps(state, props: Props) {
  return {
    token: _.get(state,'auth.token'),
  }
}


const withAuth = ( ) =>
  compose(
    connect(mapStateToProps),
    branch(
      (props) => !props.token,
      renderComponent(() => (<LoginWrapper />)),
    ),
  );

export default withAuth;
