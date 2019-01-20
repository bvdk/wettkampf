// @flow
import React, { Component } from "react";
import { Layout, Menu, Popover } from "antd";
import pathToRegexp from "path-to-regexp";
import { withRouter } from "react-router-dom";
import { queryArray } from "./../../utils";
import logo from "./../../assets/Logo_BVDK.jpg";
import "./Header.css";
import ColorBar from "../Utilities/ColorBar";
import MenuFactory from "../../utils/menu";

const { Header, Content, Footer } = Layout;

const SubMenu = Menu.SubMenu;

class AppHeader extends Component {



    constructor(props){
        super(props)

    }

    componentDidMount(){

    }

    render(){


      const handleClickMenu = e => e.key === 'logout' && this.props.logout();

      let currentMenu;
      let defaultSelectedKeys;
      if (this.props.mainMenu && this.props.location) {
        for (const item of this.props.mainMenu) {
          if (item.route && pathToRegexp(item.route).exec(this.props.location.hash.replace('#',''))) {
            currentMenu = item;
            break;
          }
        }
      }

      const getPathArray = (array, current, pid, id) => {
        const result = [String(current[id])];
        const getPath = item => {
          if (item && item[pid]) {
            result.unshift(String(item[pid]));
            getPath(queryArray(array, item[pid], id));
          }
        };
        getPath(current);
        return result;
      };
      if (currentMenu) {
        defaultSelectedKeys = getPathArray(this.props.mainMenu, currentMenu, 'mpid', 'id');
      }

      if (!defaultSelectedKeys) {
        defaultSelectedKeys = ['1'];
      }


      return (
        <div>
          <Header className="header" style={{height: 55}}>
            <div className="logo">
              <img alt={'logo'} src={logo} />
            </div>
            <Menu
              className="pull-left"
              selectedKeys={defaultSelectedKeys}
              mode="horizontal"
              onClick={handleClickMenu}
            >
              {MenuFactory.getMenuItems(this.props.mainMenu)}
            </Menu>
            <Menu
              className="pull-right"
              selectedKeys={defaultSelectedKeys}
              mode="horizontal"
              onClick={handleClickMenu}
            >
              {MenuFactory.getMenuItems(this.props.rightMenu)}
            </Menu>
          </Header>
          <ColorBar/>
        </div>

      );
    }

}


export default withRouter(AppHeader);

