// @flow
import React, { Component } from "react";
import { Icon, Layout, Breadcrumb } from "antd";

import RouterBreadcrumbs from "./../RouterBreadcrumbs";

import menu from "./menu";
import rightMenu from "./rightMenu";
import Header from "./Header";

import "./styles.css";
const { Content, Footer } = Layout;

type Props = {
  menuOpen: boolean
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

    return (
      <Layout style={{height: 'auto', minHeight: '100vh'}} className="layout">
          <Content style={{ padding: '0 50px' }}>
            <RouterBreadcrumbs />
            <div style={{ background: '#fff' }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <span>Bundesverband Deutscher Kraftdreikämpfer e.V. 2018 | Version {process.env.REACT_APP_VERSION}</span>
          </Footer>
      </Layout>
    );
  }
}

export default AppLayout;
