// @flow
import React, { Component } from 'react';
import queryString from 'query-string';
import { compose, graphql } from 'react-apollo';
import { mapProps } from 'recompose';
import _ from 'lodash';
import { loader } from 'graphql.macro';
import { Col, Row } from 'antd';
import { connect } from 'react-redux';
import EventResults from '../Results';
import EventResultsToolbar from '../ResultsToolbar';
import { setSetting } from '../../../redux/actions/settings';

const EventDisciplinesQuery = loader(
  '../../../graphql/queries/eventDisciplines.graphql'
);

type Props = {
  eventId: string,
  isFullscreen: boolean
};

class EventResultsRoute extends Component<Props, {}> {
  _toggleCollapse = () => {
    this.props.setCollapsed(!this.props.collapsed);
  };

  _handleSearchParamsChange = params => {
    this.props.history.push(`?${queryString.stringify(params)}`);
  };

  render() {
    const {
      queryParameters,
      eventId,
      availableDisciplines,
      isFullscreen
    } = this.props;

    const tmpParams = {
      ...queryParameters
    };

    return (
      <Row>
        <Col md={24}>
          <EventResultsToolbar
            showFullscreen={!isFullscreen}
            showExport={!isFullscreen}
            onChange={this._handleSearchParamsChange}
            availableDisciplines={availableDisciplines}
            eventId={eventId}
            params={tmpParams}
          />
          <hr />
          <EventResults
            availableDisciplines={availableDisciplines}
            filterParams={tmpParams}
            eventId={eventId}
          />
        </Col>
      </Row>
    );
  }
}

export default compose(
  graphql(EventDisciplinesQuery, {
    name: 'eventDisciplinesQuery',
    options: (props: Props) => ({
      variables: {
        id: props.eventId
      }
    })
  }),
  mapProps(props => ({
    isFullscreen: props.isFullscreen,
    loading: _.get(props, 'eventDisciplinesQuery.loading'),
    history: props.history,
    queryParameters: queryString.parse(_.get(props, 'history.location.search')),
    eventId: props.eventId,
    discipline: _.get(props, 'eventDisciplinesQuery.event.discipline'),
    availableDisciplines: _.get(
      props,
      'eventDisciplinesQuery.event.availableDisciplines',
      []
    )
  })),
  connect(
    (state, props) => {
      return {
        collapsed: _.get(
          state,
          'settings.resultsUpcomingAthletesCollapsed',
          false
        )
      };
    },
    dispatch => {
      return {
        setCollapsed: collapsed =>
          dispatch(setSetting('resultsUpcomingAthletesCollapsed', collapsed))
      };
    }
  )
)(EventResultsRoute);
