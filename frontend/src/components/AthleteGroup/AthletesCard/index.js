// @flow
import React, { Component } from 'react';
import { Badge, Button, Modal, message } from 'antd';
import _ from 'lodash';
import { loader } from 'graphql.macro';
import { compose, graphql } from 'react-apollo';
import withSizes from 'react-sizes';
import { withRouter } from 'react-router';
import waitWhileLoading from '../../../hoc/waitWhileLoading';
import EventAthletesUnsortedTable from '../../Event/AthletesUnsortedTable';
import RemoveAthletesFromAthleteGroupButton from '../../RemoveAthletesFromAthleteGroupButton';
import Toolbar from '../../Toolbar';
import AthletesTable from '../../AthletesTable';

const AthleteGroupAthletesQuery = loader(
  '../../../graphql/queries/athleteGroupAthletes.graphql'
);
const EventAthletesUnsortedQuery = loader(
  '../../../graphql/queries/eventAthletesUnsorted.graphql'
);
const AddAthletesToAthleteGroupMutation = loader(
  '../../../graphql/mutations/addAthletesToAthleteGroup.graphql'
);

type Props = {
  athleteGroupId: string,
  eventId: string,
  addAthletesToAthleteGroupMutation: Function,
  width?: number
};

type State = {
  visible: boolean,
  addSelectedAthleteIds: string[],
  editSelectedAthleteIds: string[]
};

class AthleteGroupAthletesCard extends Component<Props, State> {
  state = {
    visible: false,
    loadingSync: false,
    addSelectedAthleteIds: [],
    editSelectedAthleteIds: []
  };

  props: Props;

  _handleSelectChange = addSelectedAthleteIds => {
    this.setState({
      addSelectedAthleteIds
    });
  };

  setLoading = loadingSync => {
    return new Promise(resolve => {
      this.setState(
        {
          loadingSync
        },
        () => {
          resolve();
        }
      );
    });
  };

  _handleSync = () => {
    const { athleteGroupId } = this.props;
    const { addSelectedAthleteIds } = this.state;

    this.setLoading(true)
      .then(() =>
        this.props.addAthletesToAthleteGroupMutation({
          variables: {
            athleteGroupId,
            athleteIds: addSelectedAthleteIds
          }
        })
      )
      .then(() => {
        message.success('Erfolgreich eingetragen');
      })
      .catch(() => {
        message.error('Aktion konnte nicht durchgeführt werden.');
      })
      .finally(() =>
        this.setLoading(false).then(() => this.setState({ visible: false }))
      );
  };

  render() {
    const {
      athleteGroupId,
      eventAthletesUnsortedQuery,
      eventId,
      width,
      history,
      athleteGroupAthletesQuery
    } = this.props;
    const {
      loadingSync,
      addSelectedAthleteIds,
      editSelectedAthleteIds
    } = this.state;

    const unsortedAthletes = _.get(
      eventAthletesUnsortedQuery,
      'event.unsortedAthletes',
      []
    );

    const athletes = _.get(
      athleteGroupAthletesQuery,
      'athleteGroup.athletes',
      []
    );
    return (
      <div>
        <Toolbar
          renderLeft={() => <h4>{athletes.length} Athleten</h4>}
          renderRight={() => [
            <RemoveAthletesFromAthleteGroupButton
              onDone={() => this.setState({ editSelectedAthleteIds: [] })}
              style={{ marginRight: 10 }}
              key={'remove'}
              athleteGroupId={this.props.athleteGroupId}
              athleteIds={editSelectedAthleteIds}
            />,
            <Badge key={'add'} count={_.size(unsortedAthletes)}>
              <Button
                disabled={!unsortedAthletes.length}
                onClick={() => this.setState({ visible: true })}>
                Mehr Athleten verknüpfen
              </Button>
              <Modal
                destroyOnClose
                bodyStyle={{ padding: 0 }}
                width={width - 10}
                title="Athleten verknüpfen"
                visible={this.state.visible}
                okText={'Athleten in Startgruppe einfügen'}
                okButtonProps={{
                  loading: loadingSync,
                  disabled: !addSelectedAthleteIds.length
                }}
                onOk={this._handleSync}
                onCancel={() => this.setState({ visible: false })}>
                <EventAthletesUnsortedTable
                  onSelectChange={this._handleSelectChange}
                  eventId={eventId}
                />
              </Modal>
            </Badge>
          ]}
        />

        <AthletesTable
          hideKeys={['athleteGroup.name', 'athleteGroup.slot.name']}
          tableProps={{
            pagination: false
          }}
          selectedRowIds={editSelectedAthleteIds}
          onSelectChange={editSelectedAthleteIds =>
            this.setState({ editSelectedAthleteIds })
          }
          onAthleteClick={item =>
            history.push(`/events/${eventId}/athletes/${item.id}`)
          }
          athleteGroupId={athleteGroupId}
          athletes={athletes}
        />
      </div>
    );
  }
}

export default compose(
  withRouter,
  graphql(AddAthletesToAthleteGroupMutation, {
    name: 'addAthletesToAthleteGroupMutation',
    options: props => ({
      refetchQueries: [
        {
          query: EventAthletesUnsortedQuery,
          variables: {
            eventId: props.eventId
          }
        },
        {
          query: AthleteGroupAthletesQuery,
          variables: {
            id: props.athleteGroupId
          }
        }
      ]
    })
  }),
  graphql(EventAthletesUnsortedQuery, {
    name: 'eventAthletesUnsortedQuery',
    options: (props: Props) => ({
      variables: {
        eventId: props.eventId
      }
    })
  }),
  waitWhileLoading('eventAthletesUnsortedQuery'),
  graphql(AthleteGroupAthletesQuery, {
    name: 'athleteGroupAthletesQuery',
    options: (props: Props) => ({
      variables: {
        id: props.athleteGroupId
      }
    })
  }),
  waitWhileLoading('athleteGroupAthletesQuery'),
  withSizes(({ width }) => ({
    width
  }))
)(AthleteGroupAthletesCard);
