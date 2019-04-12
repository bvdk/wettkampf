// @flow
import React, {Component} from 'react';
import {Button, Modal} from "antd";
import _ from 'lodash'
import styled from "styled-components";
import Toolbar from "../Toolbar";
import EventTable from "../EventTable";

import {compose, graphql} from "react-apollo";
import {mapProps, withProps} from "recompose";
import EventCreateForm from "../EventCreateForm";
import waitWhileLoading from "../../hoc/waitWhileLoading";

import { loader } from 'graphql.macro';
import IfRole from "../../hoc/ifRole";
const EventsQuery = loader("../../graphql/queries/events.graphql");


type Props = {
  events: Event[],
  onAddEvent: Function,
  onClickEvent?: (event: Event) => void,
  onEditEvent?: (event: Event) => void,
  onRemoveEvent?: (event: Event) => void
};

type State = {
  createModal: boolean,
  createEvent?: any
};

const Wrapper = styled.div`
  background-color: #ffffff
`;

class EventsDashboard extends Component<Props, State> {
  props: Props;

  static defaultProps = {
    onClickEvent: undefined,
    onEditEvent: undefined,
    onRemoveEvent: undefined,
  }

  state = {
    createModal: false
  }


  handleCancelAddEvent = () => {
    this.setState({createModal: false});
  }



  render() {

    const {events, onEditEvent, onRemoveEvent, onClickEvent } = this.props;
    const { createModal } = this.state;

    return (
      <Wrapper>
        <Toolbar
            renderLeft={() => <h3>BVDK - Wettkämpfe</h3>}
            renderRight={()=>(<IfRole>
            <Button type="primary" onClick={()=>{this.setState({createModal: true})}}>Neues Event</Button>
        </IfRole>)} />
        <EventTable
          onClick={onClickEvent}
          events={events}
        />
        <Modal
          title="Neues Event"
          footer={false}
          visible={createModal}
          onOk={this.handleAddEvent}
          onCancel={this.handleCancelAddEvent}
        >
          <EventCreateForm
            onCreate={(created)=>{
              this.setState({
                createModal: false
              })}}
          />
        </Modal>
      </Wrapper>
    );
  }
}


export default compose(
  graphql(EventsQuery, {
    name: 'eventsQuery',
  }),
  waitWhileLoading('eventsQuery'),
  withProps((props) => ({
    events: _.get(props, 'eventsQuery.events',[]),
  }))
)(EventsDashboard)
