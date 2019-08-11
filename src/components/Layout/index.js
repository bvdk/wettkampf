// @flow
import _ from "lodash";
import React, {Component} from "react";
import {Layout} from "antd";

import "./styles.css";
import LogoutButton from "../LogoutButton";
import {graphql} from "react-apollo";
import {loader} from "graphql.macro";

const SystemQuery = loader("../../graphql/queries/system.graphql");

const { Content, Footer } = Layout;

type Props = {
  menuOpen: boolean,
  systemQuery?: any,
};

type State = {
  collapsed: boolean
};

class AppLayout extends Component<Props, State> {


  static defaultProps = {
    menuOpen: false,
  };

  constructor(props){
    super(props);

    this.state = {
      collapsed: true,
    };
  }

  componentDidMount() {}



  toggle(){
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }


  render() {

    const {systemQuery} = this.props;

    return (
      <Layout style={{height: 'auto', minHeight: '100vh'}} className="layout">
          <Content>

            <div style={{ background: '#fff' }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <span>{_.get(systemQuery, 'system.name')} | Version {_.get(systemQuery, 'system.version')}</span>
            <LogoutButton/>
          </Footer>
      </Layout>
    );
  }
}

export default graphql(SystemQuery,{
  name: 'systemQuery',
})(AppLayout)
