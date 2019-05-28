// @flow
import React, {Component} from 'react';
import queryString from "query-string";
import {compose, graphql} from "react-apollo";
import {mapProps} from "recompose";
import _ from "lodash";
import {loader} from "graphql.macro";
import EventResults from "./../../../components/EventResults";
import EventResultsToolbar from "../../../components/EventResultsToolbar";
import {Button, Col, Empty, Row} from "antd";
import {connect} from "react-redux";
import {setSetting} from "../../../redux/actions/settings";
import OrderedEventAthletes from "../../../components/OrderedEventAthletes";
import Toolbar from "../../../components/Toolbar";

const EventDisciplinesQuery = loader("../../../graphql/queries/eventDisciplines.graphql");
const EventResultClassesQuery = loader("../../../graphql/queries/eventResultClasses.graphql");


type Props = {
  eventId: string,
  isFullscreen: boolean,
  collapsed: boolean,
};

type State = {

}

class EventResultsRoute extends Component<Props, State> {


  _toggleCollapse = () => {
    console.log(this.props);
    this.props.setCollapsed(!this.props.collapsed);
  }

  _handleSearchParamsChange = (params) => {
    this.props.history.push(`?${queryString.stringify(params)}`)
  }

  render() {
    const { queryParameters, eventId, availableDisciplines, isFullscreen, collapsed } = this.props;

    let tmpParams = {
      ...queryParameters,
    }

    return  <Row>
      <Col md={collapsed ? 24 : 18}>
        <EventResultsToolbar
            showFullscreen={!isFullscreen}
            showExport={!isFullscreen}
            onChange={this._handleSearchParamsChange}
            availableDisciplines={availableDisciplines}
            eventId={eventId}
            params={tmpParams}
            renderRight={()=> this.props.collapsed ? <Button style={{marginLeft: 8}} onClick={this._toggleCollapse} icon={'menu-fold'}>{this.props.collapsed ? 'Reihenfolge einblenden' : 'Reihenfolge ausblenden'}</Button> : undefined}
        />
        <hr/>
        <EventResults availableDisciplines={availableDisciplines} filterParams={tmpParams} eventId={eventId}/>
      </Col>
      { !collapsed ? <Col md={6}>
        <Toolbar
            style={{paddingTop: 12, paddingBottom: 12}}
            renderLeft={() => <h3>Nächste Athleten</h3>}
            renderRight={() => <Button onClick={this._toggleCollapse} icon={'close'}/>}
        />
        <hr/>
        {tmpParams.slotId ? <OrderedEventAthletes highlightFirstAthlete slotId={tmpParams.slotId}/> : <Empty description={'Keine Bühne gewählt'} />}

      </Col> : null }

    </Row>

  }
}

export default compose(
    graphql(EventDisciplinesQuery, {
      name: 'eventDisciplinesQuery',
      options: (props: Props) =>({
        variables: {
          id: props.eventId
        }
      }),
    }),
    mapProps((props)=>({
      isFullscreen: props.isFullscreen,
      loading: _.get(props,'eventDisciplinesQuery.loading'),
      history: props.history,
      queryParameters: queryString.parse(_.get(props, 'history.location.search')),
      eventId: props.eventId,
      discipline: _.get(props,'eventDisciplinesQuery.event.discipline'),
      availableDisciplines: _.get(props,'eventDisciplinesQuery.event.availableDisciplines',[]),
    })),
    connect((state, props) => {
      return {
        collapsed: _.get(state,'settings.resultsUpcomingAthletesCollapsed',false)
      }
    }, (dispatch) => {
      return {
        setCollapsed: (collapsed) => dispatch(setSetting("resultsUpcomingAthletesCollapsed", collapsed))
      }
    }),
)(EventResultsRoute);

