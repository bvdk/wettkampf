// @flow
import React, { Component } from 'react';
import {loader} from "graphql.macro";
import {compose, graphql} from "react-apollo";
import _ from "lodash";
import {withProps} from "recompose";
import {Button, Icon, Modal, Table} from "antd";
import Toolbar from "../Toolbar";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import EventAthletePointsCalcButton from "./../EventAthletePointsCalcButton";
import Bold from "./../Bold";
import {withNamespaces} from "react-i18next";
import SlotAthleteGroupActivationForm from "../SlotAthleteGroupActivationForm";

const EventAttemptsQuery = loader("../../graphql/queries/nextSlotAthletes.graphql");

type Props = {
  slotId: string,
  highlightFirstAthlete?: boolean
};

type State = {
  showModal: boolean
};


class OrderedEventAthletes extends Component<Props, State> {

  state = {
    showModal: false,
  }

  _hideModal = () => {
    this.setState({
      showModal: false,
    })
  }

  renderHeader() {

    const { slot, t, discipline, activeAthleteGroup } = this.props;

    if (!activeAthleteGroup || !discipline){
      return <div>

        { !activeAthleteGroup ?
            <Button onClick={()=> this.setState({showModal: true}) } type={"danger"}>Keine aktive Startgruppe</Button> :
            !discipline ? <Button onClick={()=> this.setState({showModal: true}) } type={"danger"}>Keine aktive Disziplin</Button> : undefined
        }
      </div>
    }

    return <div className={"link"} onClick={()=> this.setState({showModal: true}) } >
      <Bold>{slot.name}:</Bold> <span>{_.get(activeAthleteGroup,'name')}</span> - <span>{t(discipline)}</span>
    </div>
  }

  render() {
    const { athletes, highlightFirstAthlete, discipline } = this.props;

    const firstAthleteId = _.get(athletes,'[0].id');

    return <div><Modal
        title={'Aktive Startgruppe und Disziplin ändern'}
        visible={this.state.showModal}
        onCancel={this._hideModal}
        onOk={this._hideModal}
    >
      <SlotAthleteGroupActivationForm slotId={this.props.slotId} />
    </Modal>
      <Table
          title={() => this.renderHeader()}
          size={'small'}
          pagination={false}
          rowClassName={highlightFirstAthlete ? (record, index) => {
            return record.id === firstAthleteId ? 'active-athlete-row' : ''
          } : null}
          columns={[{
            dataIndex: '#',
            title: '#',
            width: 30,
            render: (text, record) => record.id === firstAthleteId ? <Icon type={'right'} /> : text
          },{
            dataIndex: 'name',
            title: 'Name',
          },{
            dataIndex: 'nextAttempt.weight',
            title: 'Gewicht',
            render: (text, item) => {
              const weight = _.chain(item)
                  .get('nextAttempts')
                  .filter({
                    discipline,
                  })
                  .first()
                  .get('weight')
                  .value();
              if (weight){
                return `${weight} kg`;
              }
              return null
            }
          },{
            dataIndex: 'nextAttemptCount',
            title: 'V.',
            render: (text, item) => {
              const index = _.chain(item).get('nextAttempts[0].index').value();
              if (index < 3){
                return index +1 ;
              }
              return null
            }
          }]}
          scroll={{x: 200}}
          dataSource={athletes}
          footer={() => <Toolbar
              style={{padding: 0}}
              renderLeft={() => <span>{athletes.length} Athleten</span>}
              renderRight={() => <EventAthletePointsCalcButton slotId={this.props.slotId} eventId={this.props.eventId} />}
          />}
      />
    </div>;
  }
}



export default compose(
  graphql(EventAttemptsQuery, {
    name: 'nextSlotAthletesQuery',
    options: (props: Props) =>{

      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          slotId: props.slotId,
        }
      }
    },
  }),
  waitWhileLoading('nextSlotAthletesQuery'),
  withProps((props)=>({
    loading: _.get(props,'nextSlotAthletesQuery.loading',false),
    slotId: props.slotId,
    onAthleteClick: props.onAthleteClick,
    slot: _.get(props,'nextSlotAthletesQuery.slot'),
    eventId: _.get(props,'nextSlotAthletesQuery.slot.eventId'),
    discipline: _.get(props,'nextSlotAthletesQuery.slot.activeDiscipline'),
    activeAthleteGroup: _.get(props,'nextSlotAthletesQuery.slot.activeAthleteGroup'),
    athletes: _.get(props,'nextSlotAthletesQuery.slot.nextAthletes',[]).map((item, index)=> ({
      ...item,
      '#': index+1
    }))
  })),
    withNamespaces()
)(OrderedEventAthletes);

