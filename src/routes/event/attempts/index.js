import React, {Component} from 'react';
import queryString from "query-string";
import {compose, graphql} from "react-apollo";
import waitWhileLoading from "../../../hoc/waitWhileLoading";
import {mapProps} from "recompose";
import _ from "lodash";
import {loader} from "graphql.macro";
import EventAttempts from "./../../../components/EventAttempts";
import EventAttemptsToolbar from "../../../components/EventAttemptsToolbar";
import OrderedEventAthletes from "../../../components/OrderedEventAthletes";
import {Button, Col, Row} from "antd";
import withAuth from "../../../hoc/withAuth";
import Toolbar from "../../../components/Toolbar";

const EventSlotsDisciplinesAthleteGroups = loader("../../../graphql/queries/eventSlotsDisciplinesAthleteGroups.graphql");

type Props = {
  eventId: string,
};

type State = {
  collapsed: boolean
}

class EventAttemptsRoute extends Component<Props, State> {

  state = {
    collapsed: false,
  }

  _handleSearchParamsChange = (params) => {
    this.props.history.push(`?${queryString.stringify(params)}`)
  }

  _toggleCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    const { queryParameters, eventId, discipline, athleteGroups, slots, availableDisciplines } = this.props;
    const { collapsed } = this.state;

    let tmpParams = {
      athleteGroupId: _.chain(athleteGroups).first().get('id').value(),
      slotId: _.chain(slots).first().get('id').value(),
      discipline: _.first(availableDisciplines),
      ...queryParameters,
    }

    return <Row>
      <Col md={collapsed ? 24 : 18}>
        <EventAttemptsToolbar
            onChange={this._handleSearchParamsChange}
            availableDisciplines={availableDisciplines}
            eventId={eventId}
            renderRight={()=> this.state.collapsed ? <Button onClick={this._toggleCollapse} icon={'menu-fold'}>{this.state.collapsed ? 'Reihenfolge einblenden' : 'Reihenfolge ausblenden'}</Button> : undefined}
            params={tmpParams}/>
        <hr/>
        <EventAttempts filterParams={tmpParams} eventId={eventId}/>
      </Col>
      { !collapsed ? <Col md={6}>
        <Toolbar
            style={{paddingTop: 16}}
            renderLeft={() => <h3>Nächste Athleten</h3>}
            renderRight={() => <Button onClick={this._toggleCollapse} icon={'close'}/>}
        />
        <hr/>
        <OrderedEventAthletes highlightFirstAthlete slotId={tmpParams.slotId}/>
      </Col> : null }

    </Row>

  }
}

export default compose(
    graphql(EventSlotsDisciplinesAthleteGroups, {
      name: 'query',
      options: (props: Props) =>({
        variables: {
          id: props.eventId
        }
      }),
    }),
    waitWhileLoading('query'),
    mapProps((props)=>({
      loading: _.get(props,'query.loading'),
      history: props.history,
      queryParameters: queryString.parse(_.get(props, 'history.location.search')),
      eventId: props.eventId,
      discipline: _.get(props,'query.event.discipline'),
      slots: _.get(props,'query.event.slots',[]),
      athleteGroups: _.get(props,'query.event.athleteGroups',[]),
      availableDisciplines: _.get(props,'query.event.availableDisciplines',[]),
    }))
)(EventAttemptsRoute);

