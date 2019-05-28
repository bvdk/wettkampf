// @flow
import React, { Component } from 'react';
import {graphql, compose} from "react-apollo";
import _ from 'lodash';
import OfficialSlotsTable from "../OfficialSlotsTable";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import {mapProps} from "recompose";
import {loader} from "graphql.macro";
import Toolbar from "../Toolbar";
import Bold from "../Bold";
import {Button, Modal, message} from "antd";
import OfficialSlotCreateForm from "./../OfficialSlotCreateForm"
import Strings from "../../constants/strings";

const OfficialSlotsQuery = loader("../../graphql/queries/slotOfficialSlots.graphql");
const RemoveOfficialSlotMutation = loader("../../graphql/mutations/deleteOfficialSlot.graphql");

type Props = {
  slotId: string,
  eventId: string,
  removeOfficialSlotMutation: Function,
};

type State = {
  showModal: boolean,
  selectedRowKeys: string[],
  removing: boolean
}

class SlotOfficialSlotsTable extends Component<Props, State> {


  state = {
    showModal: false,
    selectedRowKeys: [],
    removing: false
  }

  _handleRemoveSelected = () => {
    this.setRemoving(true)
      .then(() => Promise.all(this.state.selectedRowKeys.map(id => this.props.removeOfficialSlotMutation({
        variables: {
          id
        }
      }))))
      .then(() => {
        this.setState({
          selectedRowKeys: [],
        });
        this.setRemoving(false);
        message.success('Kampfrichter wurden entfernt')
      })
      .catch((err)=> {
        console.error(err);
        message.error(Strings.errorOccurred)
      })
  }

  setRemoving = (removing) => {
          return new Promise((resolve) => {
              this.setState({
                removing
              }, resolve)
          })
      }

  render() {
    const { officialSlots, slotId, eventId } = this.props;
    const {selectedRowKeys } = this.state;

    return <div>
      <Toolbar
        renderLeft={() => <Bold>Kampfrichter</Bold>}
        renderRight={() => [
          this.state.selectedRowKeys.length ? <Button loading={this.state.removing} style={{marginRight: 10}} key={'delete'} type={'danger'} onClick={this._handleRemoveSelected} icon={'minus'}>Entfernen</Button> : null,
          <Button key={'new'} onClick={()=>this.setState({showModal: true})} icon={'plus'}>Hinzufügen</Button>
        ]}/>
        <Modal
          visible={this.state.showModal}
          title={'Kampfrichter einfügen'}
          onCancel={()=> this.setState({showModal: false})}
          destroyOnClose
          footer={false}
        >
          <OfficialSlotCreateForm onCreate={()=> this.setState({showModal: false})} eventId={eventId} slotId={slotId}/>
        </Modal>
      <div className={"border"}>
        <OfficialSlotsTable
            onSelectionChange={(selectedRowKeys) => this.setState({selectedRowKeys})}
            selectedRowKeys={selectedRowKeys}
            officialSlots={officialSlots}/>
      </div>
    </div>;
  }
}

export default compose(
  graphql(RemoveOfficialSlotMutation,{
    name: 'removeOfficialSlotMutation',
    options: (props) => ({
      refetchQueries: [
        {
          query: OfficialSlotsQuery,
          variables: {
            id: props.slotId
          }
        }
      ]
    })
  }),
  graphql(OfficialSlotsQuery, {
    name: 'officialSlotsQuery',
    options: (props: Props) =>({
      variables: {
        id: props.slotId
      }
    }),
  }),
  waitWhileLoading('officialSlotsQuery'),
  mapProps((props)=>({
      removeOfficialSlotMutation: props.removeOfficialSlotMutation,
    slotId: props.slotId,
    eventId: props.eventId,
    officialSlots: _.get(props,'officialSlotsQuery.slot.officialSlots',[]),
  }))
)(SlotOfficialSlotsTable);
