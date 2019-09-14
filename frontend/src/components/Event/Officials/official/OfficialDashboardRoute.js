// @flow
import React, { Component } from 'react';
import _ from 'lodash'
import {graphql, compose} from "react-apollo";
import Toolbar from "../../../Toolbar";
import {loader} from "graphql.macro";
import waitWhileLoading from "../../../../hoc/waitWhileLoading";
import {Button, message, Popconfirm} from "antd";
import Strings from "../../../../constants/strings";
import {withRouter} from "react-router";
import OfficialUpdateForm from "../../../Official/UpdateForm"
import styled from "styled-components";
import BackButton from "../../../BackButton";

const OfficialQuery = loader("../../../../graphql/queries/officialName.graphql");
const DeleteMutation = loader("./../../../../graphql/mutations/deleteOfficial.graphql");

type Props = {
  eventId: string,
  officialId: string,
  deleteMutation: Function
};

type State = {
  deleting: boolean,
}

const Wrapper = styled.div`
    padding: 10px;
`


class OfficialDashboardRoute extends Component<Props, State> {

  state = {
    deleting: false
  }

  _handleDelete = () => {

    const {eventId, officialId,  history, deleteMutation} = this.props;

    this.setDeleting(true)
      .then(() => deleteMutation({
        variables: {
          id: officialId
        }
      }))
      .then(()=>{
        this.setDeleting(false)
      })
      .then(()=>{
        history.push(`/events/${eventId}/officials`);
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


  render()
  {
    const {officialQuery, officialId} = this.props;

    return <div>
      <Toolbar
        renderLeft={()=><span>
                <BackButton />
                <h3 style={{display: 'inline', marginLeft: 8}}>{_.get(officialQuery, 'official.name')}</h3>
              </span>}

        renderRight={() => <Popconfirm
          onConfirm={this._handleDelete}
          title={Strings.areYouSure}>
          <Button type={'danger'}
                  loading={this.state.deleting}>Löschen</Button>
        </Popconfirm>}
        borderBottom={true}/>

      <Wrapper>
        <OfficialUpdateForm officialId={officialId}/>
      </Wrapper>



    </div>;
  }
}

export default compose(
  graphql(OfficialQuery, {
    name: 'officialQuery',
    options: (props: Props) =>({
      variables: {
        id: props.officialId
      }
    }),
  }),
  withRouter,
  waitWhileLoading('officialQuery'),
  graphql(DeleteMutation,{
    name: 'deleteMutation',
    options: (props: Props) =>({
      variables: {
        id: props.officialId
      }
    }),
  })
)(OfficialDashboardRoute);
