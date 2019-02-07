// @flow
import React, { Component } from 'react';
import {Icon, Menu, Layout} from "antd";
import {Link} from "react-router-dom";
import _ from "lodash";
import {graphql} from "react-apollo";
import {loader} from "graphql.macro";

const EventNameQuery = loader("../../graphql/queries/eventName.graphql");

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Header, Content, Sider } = Layout;

type Props = {
  eventId: string,
};

class EventMenu extends Component<Props> {
  props: Props;

  render() {

    const {eventId, selectedKey, eventNameQuery} = this.props;
    return (
      <div>
        <Header className="event-header">
          <div>
            <Icon type="trophy"/>
            <span style={{padding: '0 10px', fontWeight: 700}}>{_.get(eventNameQuery,'event.name')}</span>
          </div>
        </Header>
        <Menu
          style={{minWidth: 200}}
          theme="dark"
          selectedKeys={[selectedKey]}
        >
          <MenuItemGroup key="g1" title="Allgemeines">
            <Menu.Item key="athletes">
              <Link to={`/events/${eventId}/athletes`}>
                <Icon type="team" />
                Athleten
              </Link>
            </Menu.Item>
            <Menu.Item key="athleteGroups">
              <Link to={`/events/${eventId}/athleteGroups`}>
                <Icon type="table" />
                Startgruppen
              </Link>
            </Menu.Item>
            <Menu.Item key="slots">
              <Link to={`/events/${eventId}/slots`}>
                <Icon type="cluster" />
                Bühnen
              </Link>
            </Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup key="g2" title="Wettkampf">
            <Menu.Item key="attempts">
              <Link to={`/events/${eventId}/attempts`}>
                <Icon type="issues-close" />
                Versuche
              </Link>
            </Menu.Item>
            <Menu.Item key="results">
              <Link to={`/events/${eventId}/results`}>
                <Icon type="table" />
                Ergebnisse
              </Link>
            </Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup key="g3" title="Einstellungen">
            <Menu.Item key="edit">
              <Link to={`/events/${eventId}/edit`}>
                <Icon type="edit" />
                Bearbeiten
              </Link>
            </Menu.Item>
          </MenuItemGroup>
        </Menu>
      </div>
    );
  }
}

export default graphql(EventNameQuery,{
  name: 'eventNameQuery',
  options: (props) => ({
    variables: {
      id: props.eventId
    }
  })
})(EventMenu)
