// @flow
import React, { Fragment, Component } from 'react';
import { Icon, Menu, Layout } from 'antd';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { graphql } from 'react-apollo';
import { loader } from 'graphql.macro';
import OneLineLabel from '../../OneLineLabel';

const EventNameQuery = loader('../../../graphql/queries/eventName.graphql');

const MenuItemGroup = Menu.ItemGroup;
const { Header } = Layout;

type Props = {
  eventId: string
};

class EventMenu extends Component<Props> {
  render() {
    const { eventId, selectedKey, eventNameQuery } = this.props;
    return (
      <Fragment>
        <Header className="event-header">
          <Link to="/events">
            <div
              style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
              <Icon type="trophy" />
              <OneLineLabel maxWidth={150}>
                <span style={{ padding: '0 10px', fontWeight: 700 }}>
                  {_.get(eventNameQuery, 'event.name')}
                </span>
              </OneLineLabel>
            </div>
          </Link>
        </Header>
        <Menu
          style={{ minWidth: 200 }}
          theme="dark"
          selectedKeys={[selectedKey]}>
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
            <Menu.Item key="officials">
              <Link to={`/events/${eventId}/officials`}>
                <Icon type="flag" />
                Kampfrichter
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
            <Menu.Item key="public">
              <Link to={`/public/settings/${eventId}`}>
                <Icon type="setting" />
                Anzeigeeinstellungen
              </Link>
            </Menu.Item>
          </MenuItemGroup>
        </Menu>
      </Fragment>
    );
  }
}

export default graphql(EventNameQuery, {
  name: 'eventNameQuery',
  options: props => ({
    variables: {
      id: props.eventId
    }
  })
})(EventMenu);
