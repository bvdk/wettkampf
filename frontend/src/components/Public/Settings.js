// @flow
import React, { useEffect, useState, useCallback } from 'react';
import { loader } from 'graphql.macro';
import { Select } from 'antd';

type SettingsProps = {
  client: any,
  match: any
};

const { Option } = Select;

const EventSlotsQuery = loader('../../graphql/queries/eventSlots.graphql');
const EventSlotsDisciplinesAthleteGroupsQuery = loader(
  '../../graphql/queries/eventSlotsDisciplinesAthleteGroups.graphql'
);
const EventAthleteGroupsQuery = loader(
  '../../graphql/queries/eventAthleteGroups.graphql'
);
const SetPublicConfigMutation = loader(
  '../../graphql/mutations/setPublicConfigMutation.graphql'
);

const Settings = (props: SettingsProps) => {
  const { eventId } = props.match.params;
  const [data, setData] = useState({ eventId });
  const [slots, setSlots] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [athleteGroups, setAthleteGroups] = useState([]);

  const publish = useCallback(() => {
    props.client.mutate({
      mutation: SetPublicConfigMutation,
      variables: { data }
    });
  }, [data, props.client]);

  useEffect(() => {
    Promise.all([
      props.client
        .query({
          query: EventSlotsQuery,
          variables: {
            eventId
          },
          fetchPolicy: 'network-only'
        })
        .then(resp => resp.data.event.slots),
      props.client
        .query({
          query: EventAthleteGroupsQuery,
          variables: {
            eventId
          },
          fetchPolicy: 'network-only'
        })
        .then(resp => resp.data.event.athleteGroups),
      props.client
        .query({
          query: EventSlotsDisciplinesAthleteGroupsQuery,
          variables: {
            id: eventId
          },
          fetchPolicy: 'network-only'
        })
        .then(resp => resp.data.event.availableDisciplines)
    ]).then(([eventSlots, eventAthleteGroups, availableDisciplines]) => {
      setSlots(eventSlots);
      setAthleteGroups(eventAthleteGroups);
      setDisciplines(availableDisciplines);
    });
  }, [eventId, props.client]);

  return (
    <div className="w-100">
      <div>
        <Select
          mode="default"
          placeholder="Bühne auswählen"
          value={data.slotId}
          onChange={slotId => setData({ ...data, slotId })}>
          {slots.map(slot => (
            <Option key={slot.id} value={slot.id}>
              {slot.name}
            </Option>
          ))}
        </Select>
      </div>
      <div>
        <Select
          mode="default"
          placeholder="Disziplin auswählen"
          value={data.discipline}
          onChange={discipline => setData({ ...data, discipline })}>
          {disciplines.map(discipline => (
            <Option key={discipline} value={discipline}>
              {discipline}
            </Option>
          ))}
        </Select>
      </div>
      <div>
        {data.slotId ? (
          <Select
            mode="tags"
            placeholder="Startgruppen auswählen"
            value={data.athleteGroupIds}
            onChange={athleteGroupIds => setData({ ...data, athleteGroupIds })}>
            {athleteGroups
              .filter(athleteGroup => athleteGroup.slotId === data.slotId)
              .map(athleteGroup => (
                <Option key={athleteGroup.id} value={athleteGroup.id}>
                  {athleteGroup.name || athleteGroup.id}
                </Option>
              ))}
          </Select>
        ) : null}
      </div>

      {data.athleteGroupIds && data.discipline ? (
        <button className="btn btn-primary" onClick={publish}>
          Veröffentlichen
        </button>
      ) : null}
    </div>
  );
};

export default React.memo(Settings);
