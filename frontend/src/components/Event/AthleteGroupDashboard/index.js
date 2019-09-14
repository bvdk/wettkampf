// @flow
import React, { Component } from 'react';
import { loader } from 'graphql.macro';
import { compose, graphql } from 'react-apollo';
import _ from 'lodash';
import { mapProps } from 'recompose';
import { Link } from 'react-router-dom';
import waitWhileLoading from '../../../hoc/waitWhileLoading';
import Toolbar from '../../Toolbar';
import BackButton from '../../BackButton';
import AthleteGroupAthletesCard from '../../AthleteGroup/AthletesCard';

const EventAthleteGroupQuery = loader(
  '../../../graphql/queries/athleteGroup.graphql'
);

type Props = {
  eventId: string,
  athleteGroupId: string
};

class EventAthleteGroupDashboard extends Component<Props> {
  props: Props;

  render() {
    const { eventId, athleteGroupId, athleteGroup } = this.props;

    return (
      <div>
        <Toolbar
          borderBottom
          renderLeft={() => (
            <span>
              <BackButton />
              <h3 style={{ display: 'inline', marginLeft: 8 }}>
                {_.get(athleteGroup, 'name')}
              </h3>
            </span>
          )}
          renderRight={() => (
            <Link
              to={`/events/${eventId}/athleteGroups/${athleteGroupId}/edit`}>
              Bearbeiten
            </Link>
          )}
        />

        <AthleteGroupAthletesCard
          eventId={eventId}
          athleteGroupId={athleteGroupId}
        />
      </div>
    );
  }
}

export default compose(
  graphql(EventAthleteGroupQuery, {
    name: 'eventAthleteGroupQuery',
    options: (props: Props) => ({
      variables: {
        id: props.athleteGroupId
      }
    })
  }),
  waitWhileLoading('eventAthleteGroupQuery'),
  mapProps(({ eventId, athleteGroupId, eventAthleteGroupQuery }) => ({
    eventId,
    athleteGroupId,
    athleteGroup: _.get(eventAthleteGroupQuery, 'athleteGroup')
  }))
)(EventAthleteGroupDashboard);
