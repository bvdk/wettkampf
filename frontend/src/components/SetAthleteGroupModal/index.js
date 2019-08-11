// @flow
import React, { Component } from 'react';
import {Modal, message} from "antd";
import {compose, graphql} from "react-apollo";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import {withProps} from "recompose";
import _ from "lodash";
import {loader} from "graphql.macro";
import AthleteGroupTable from "../AthleteGroupTable";
import Infobox from "../Infobox";
import Bold from "../Bold";

const EventAthleteGroupsQuery = loader("../../graphql/queries/eventAthleteGroups.graphql");
const AddAthletesToAthleteGroupMutation = loader("../../graphql/mutations/addAthletesToAthleteGroup.graphql");

type Props = {
    eventId: string,
    modalProps: any,
    athleteIds: string[],
    addAthletesToAthleteGroupMutation: Function,
};

type State = {
    athleteGroupId: string
}

class SetAthleteGroupModal extends Component<Props, State> {
  props: Props;

  state = {
      athleteGroupId: null,
  }

  static defaultProps = {
      selectedAthleteIds: [],
  }

    _handleSelectChange = (selectedIds) => {

        const athleteGroupId = _.first(selectedIds);
        this.setState({
            athleteGroupId
        })
    }

    _handleOk = () => {
        this.setSubmitting(true)
            .then(()=>{
                return this.props.addAthletesToAthleteGroupMutation({
                    variables: {
                        athleteGroupId: this.state.athleteGroupId,
                        athleteIds: this.props.athleteIds,
                    }
                })
            })
            .then(() => {
                message.success("Athleten wurden zugeordnet")
            })
            .catch(() => {
                message.error("Athleten konnten nicht zugewiesen werden")
            })
            .then(()=>{
                return this.setSubmitting(false)
            })
            .then(()=>{
                const onCancel = _.get(this.props,'modalProps.onCancel');
                if (onCancel){
                    onCancel();
                }
            })
    }

    setSubmitting = (submitting) => {
      return new Promise((response, reject)=>{
          this.setState({
              submitting,
          },() => {
              response();
          })
      })
    }

  render() {

      const {modalProps, eventId, athleteGroups, athleteIds} = this.props;

      return (
      <Modal
          title={"Athleten zu einer Startgruppe zuorden"}
          {...modalProps}
          onOk={this._handleOk}
          okButtonProps={{
              disabled: !this.state.athleteGroupId,
          }}
          width={750}
      >
          <Infobox><Bold>{athleteIds.length}</Bold> Athleten werden <Bold>einer</Bold> Startgruppe zugeorndet werden. Bitte wählen Sie die entsprechnde Startgruppe aus.</Infobox>
          <AthleteGroupTable
                onSelectChange={this._handleSelectChange}
                selectionConfig={{type: 'radio'}}
              hideKeys={['action']}
              eventId={eventId}
              athleteGroups={athleteGroups}/>
      </Modal>
    );
  }
}


export default compose(

    graphql(EventAthleteGroupsQuery, {
        name: 'query',
        options: (props: Props) =>({
            variables: {
                eventId: props.eventId
            }
        }),
    }),
    waitWhileLoading('query'),
    withProps((props)=>({
        athleteGroups: _.get(props,'query.event.athleteGroups',[])
    })),
    graphql(AddAthletesToAthleteGroupMutation,{
        name: 'addAthletesToAthleteGroupMutation',
    })

)(SetAthleteGroupModal);

