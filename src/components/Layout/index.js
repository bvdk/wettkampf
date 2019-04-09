// @flow
import React, {Component} from "react";
import {Layout} from "antd";

import "./styles.css";
import LogoutButton from "../LogoutButton";

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
          <Content>

            <div style={{ background: '#fff' }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <span>Bundesverband Deutscher Kraftdreikämpfer e.V. 2018 | Version {process.env.REACT_APP_VERSION}</span>
            <LogoutButton/>
          </Footer>
      </Layout>
    );
  }
}

export default AppLayout;
