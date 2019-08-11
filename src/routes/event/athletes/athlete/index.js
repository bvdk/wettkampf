// @flow
import React from 'react';
import {graphql, compose} from "react-apollo";
import {Button, Popconfirm, Tabs, message} from "antd";
import styled from "styled-components";
import _ from 'lodash';
import {withProps} from "recompose";
import {loader} from "graphql.macro";
import AthleteUpdateForm from "./../../../../components/AthleteUpdateForm";
import AthleteAttemptsTabs from "../../../../components/AthleteAttemptsTabs";
import Toolbar from "../../../../components/Toolbar";
import waitWhileLoading from "../../../../hoc/waitWhileLoading";
import Strings from "../../../../constants/strings";
import BackButton from "../../../../components/BackButton";
import IfRole from "../../../../hoc/ifRole";

const DeleteAthleteMutation = loader("./../../../../graphql/mutations/deleteAthlete.graphql");
const AthleteQuery = loader("./../../../../graphql/queries/athlete.graphql");

const TabPane = Tabs.TabPane;


const Wrapper = styled.div`
    padding: 10px;
`

type Props = {
  deleteAthleteMutation: Function,
  eventId: string,
  athleteId: string,
  tabIndex: string,
  athleteQuery: any,
  history: any
}

type State = {
  deleting: boolean
}

class EventAthleteRoute extends React.Component<Props, State> {

  state = {
    deleting: false
  }

  _handleDelete = () => {

    const {eventId, athleteId,  history} = this.props;

    this.setDeleting(true)
      .then(() => this.props.deleteAthleteMutation({
        variables: {
          id: athleteId
        }
      }))
      .then(()=>{
        this.setDeleting(false)
      })
      .then(()=>{
        history.push(`/events/${eventId}/athletes`);
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

    const {eventId, athleteId, tabIndex, athleteQuery, history} = this.props;

    return (
      <IfRole showError>
        <Toolbar
          renderLeft={() => <div>
            <BackButton/>
            <h3 style={{display: 'inline', marginLeft: 8}}>{_.get(athleteQuery, 'athlete.name')}</h3>
          </div>}
          renderRight={() => <Popconfirm
            onConfirm={this._handleDelete}
            title={Strings.areYouSure}>
            <Button type={'danger'}
                    loading={this.state.deleting}>Löschen</Button>
          </Popconfirm>}
          borderBottom={true}/>
        <Tabs defaultActiveKey={tabIndex} onChange={(key) => {
          console.log(`/events/${eventId}/athlete/${athleteId}/${key}`);
          return history.push(`/events/${eventId}/athletes/${athleteId}/${key}`);
        }}>
          <TabPane tab="Stammdaten" key="form">
            <Wrapper>
              <AthleteUpdateForm athleteId={athleteId}/>
            </Wrapper>

          </TabPane>
          <TabPane tab="Versuche" key="attempts">
            <Wrapper>
              <AthleteAttemptsTabs athleteId={athleteId} eventId={eventId}/>
            </Wrapper>
          </TabPane>
        </Tabs>
      </IfRole>

    );
  }
}

export default compose(
  withProps((props)=>({
    eventId: props.eventId || _.get(props.match, 'params.eventId'),
    athleteId: props.athleteId || _.get(props.match, 'params.athleteId'),
    tabIndex: props.tabIndex || _.get(props.match, 'params.tabIndex'),
  })),
  graphql(AthleteQuery, {
    name: 'athleteQuery',
    options: (props: Props) =>({
      variables: {
        id: props.athleteId
      }
    }),
  }),
  waitWhileLoading('athleteQuery'),
  graphql(DeleteAthleteMutation,{
    name: 'deleteAthleteMutation'
  })
)(EventAthleteRoute)
