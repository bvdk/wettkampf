// @flow
import React, { Component } from 'react';
import {Button, Col, message, Popconfirm, Row} from "antd";
import {graphql, compose} from "react-apollo";
import SlotUpdateForm from "../../../../components/SlotUpdateForm";
import Toolbar from "../../../../components/Toolbar";
import {loader} from "graphql.macro";
import {withRouter} from "react-router";
import waitWhileLoading from "../../../../hoc/waitWhileLoading";
import _ from "lodash";
import Strings from "../../../../constants/strings";
import styled from "styled-components";

const SlotQuery = loader("../../../../graphql/queries/slotName.graphql");
const DeleteMutation = loader("./../../../../graphql/mutations/deleteSlot.graphql");

type Props = {
  slotId: string,
  eventId: string,
  slotQuery: any,
};

type State = {
  deleting: boolean,
}

const Wrapper = styled.div`
    padding: 10px;
`

class SlotDashboardRoute extends Component<Props, State> {
  state = {
    deleting: false
  }

  _handleDelete = () => {

    const {eventId, slotId,  history, deleteMutation} = this.props;

    this.setDeleting(true)
      .then(() => deleteMutation({
        variables: {
          id: slotId
        }
      }))
      .then(()=>{
        this.setDeleting(false)
      })
      .then(()=>{
        history.push(`/events/${eventId}/slots`);
      })
      .catch((err)=>{
        message.error(Strings.errorOccurred);
      })
  }

  setDeleting = (deleting) => {
    return new Promise((resolve) => {
      this.setState({
        deleting
      }, resolve)
    })
  }

  render() {
    const { slotId, slotQuery } = this.props;

    return <div>
      <Toolbar
        renderLeft={() => <h3>{_.get(slotQuery, 'slot.name')}</h3>}
        renderRight={() => <Popconfirm
          onConfirm={this._handleDelete}
          title={Strings.areYouSure}>
          <Button type={'danger'}
                  loading={this.state.deleting}>Löschen</Button>
        </Popconfirm>}
        borderBottom={true}/>
      <Row>
        <Col md={12}>
          <Wrapper>
            <SlotUpdateForm slotId={slotId}/>
          </Wrapper>

        </Col>

        <Col md={12}>

        </Col>
      </Row>
    </div>;
  }
}

export default compose(
  graphql(SlotQuery, {
    name: 'slotQuery',
    options: (props: Props) =>({
      variables: {
        id: props.slotId
      }
    }),
  }),
  withRouter,
  waitWhileLoading('slotQuery'),
  graphql(DeleteMutation,{
    name: 'deleteMutation',
    options: (props: Props) =>({
      variables: {
        id: props.slotId
      }
    }),
  })
)(SlotDashboardRoute);
