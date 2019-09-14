// @flow
import React, { Component } from 'react';
import { loader } from 'graphql.macro';
import _ from 'lodash';
import { compose, graphql } from 'react-apollo';
import { mapProps } from 'recompose';
import { Button } from 'antd';
import AthletesTable from '../../AthletesTable';
import Toolbar from '../../Toolbar';
import SetAthleteGroupModal from '../../Modals/SetAthleteGroup';
import IfRole from '../../../hoc/ifRole';

const EventAthletesQuery = loader(
  '../../../graphql/queries/eventAthletesQuery.graphql'
);

type Props = {
  eventId: string,
  athletes: any[]
};

type State = {
  selectedAthleteIds: string[],
  showSetAthleteGroupsModal: boolean
};

class EventAthletesTable extends Component<Props, State> {
  state = {
    showSetAthleteGroupsModal: false,
    selectedAthleteIds: []
  };

  _handleSelectChange = selectedAthleteIds => {
    this.setState({
      selectedAthleteIds
    });
  };

  renderLeftTools = () => {
    const { eventId } = this.props;
    const { selectedAthleteIds, showSetAthleteGroupsModal } = this.state;

    return (
      <IfRole>
        <Button
          disabled={!selectedAthleteIds.length}
          onClick={() => {
            this.setAthleteGroupsModal(true);
          }}>
          Startgruppe zuweisen
        </Button>
        <SetAthleteGroupModal
          eventId={eventId}
          athleteIds={selectedAthleteIds}
          modalProps={{
            onCancel: () => this.setAthleteGroupsModal(false),
            visible: showSetAthleteGroupsModal
          }}
        />
      </IfRole>
    );
  };

  render() {
    const { athletes, onAthleteClick, loading } = this.props;

    return (
      <div>
        <Toolbar renderLeft={this.renderLeftTools} />
        <AthletesTable
          tableProps={{ loading }}
          onAthleteClick={onAthleteClick}
          onSelectChange={this._handleSelectChange}
          athletes={athletes}
        />
      </div>
    );
  }

  setAthleteGroupsModal(visible) {
    console.log(visible);
    this.setState({
      showSetAthleteGroupsModal: visible
    });
  }
}

export default compose(
  graphql(EventAthletesQuery, {
    name: 'eventAthletesQuery',
    options: (props: Props) => ({
      variables: {
        eventId: props.eventId
      }
    })
  }),
  mapProps(props => ({
    loading: _.get(props, 'eventAthletesQuery.loading'),
    eventId: props.eventId,
    onAthleteClick: props.onAthleteClick,
    athletes: _.get(props, 'eventAthletesQuery.event.athletes', [])
  }))
)(EventAthletesTable);
