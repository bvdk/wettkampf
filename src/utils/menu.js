import React from "react"
import { Menu, Icon } from 'antd';
import {Link} from "react-router-dom";

const SubMenu = Menu.SubMenu;

export default class MenuFactory {



  static getMenuItems(menu, caretDown = true) {

    return menu.map(item => {


      if (item.items && item.items.length > 0) {
        return <SubMenu key={item.id} title={
          <span>{item.icon ? <Icon type={item.icon}/> : null} {item.name} {caretDown? <Icon type="caret-down" style={{fontSize: 8, position: 'relative', top: -2}} /> : null}</span>
        }>
          {MenuFactory.getMenuItems(item.items, caretDown)}
        </SubMenu>
      }

      console.log('item',item);
      return <Menu.Item key={item.id}>
        <Link to={item.route || '/'}>
          {item.icon ? <Icon type={item.icon}/> : null} {item.name}
        </Link>
      </Menu.Item>
    })
  }
}
