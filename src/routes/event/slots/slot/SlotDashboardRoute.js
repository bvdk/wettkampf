// @flow
import React, { Component } from 'react';
import {Button, Col, message, Popconfirm, Row} from "antd";
import {graphql, compose} from "react-apollo";
import SlotUpdateForm from "../../../../components/SlotUpdateForm";
import BackButton from "../../../../components/BackButton";
import Toolbar from "../../../../components/Toolbar";
import SlotOfficialSlotsTable from "../../../../components/SlotOfficialSlots";
import {loader} from "graphql.macro";
import {withRouter} from "react-router";
import waitWhileLoading from "../../../../hoc/waitWhileLoading";
import _ from "lodash";
import Strings from "../../../../constants/strings";
import styled from "styled-components";
import Bold from "../../../../components/Bold";

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
    const { slotId, slotQuery, eventId } = this.props;

    return <div>
      <Toolbar
        renderLeft={()=><span>
                <BackButton />
                <h3 style={{display: 'inline', marginLeft: 8}}>{_.get(slotQuery, 'slot.name')}</h3>
              </span>}

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
            <div style={{marginTop: 10}}>
              <div  style={{marginBottom: 12}}>
                <Bold>Informationen</Bold>
              </div>
              <SlotUpdateForm slotId={slotId}/>
            </div>


          </Wrapper>

        </Col>

        <Col md={12}>
          <Wrapper>

              <SlotOfficialSlotsTable eventId={eventId} slotId={slotId}/>
          </Wrapper>
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
