// @flow
import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { compose, graphql } from 'react-apollo';
import _ from 'lodash';
import { loader } from 'graphql.macro';
import { withProps } from 'recompose';
import { Badge, Icon, List } from 'antd';

const AthleteGroupsQuery = loader(
  '../../../graphql/queries/slotAthleteGroups.graphql'
);
const SortMutation = loader(
  '../../../graphql/mutations/updateAthleteGroupSortId.graphql'
);

type Props = {
  slotId: string,
  sortMutation: () => void
};

type State = {
  loading: boolean
};

const SortableItem = SortableElement(({ item, index }) => (
  <List.Item>
    <List.Item.Meta
      title={item.name}
      avatar={<div style={{ fontSize: '14px' }}>{index + 1}</div>}
    />
    <span>
      {item.active ? (
        <Badge style={{ marginRight: 10 }} status="processing" text={'Aktiv'} />
      ) : (
        undefined
      )}
      <Icon type="drag" />
    </span>
  </List.Item>
));

const SortableList = SortableContainer(({ items, loading }) => {
  return (
    <List
      loading={loading}
      dataSource={items}
      renderItem={(item, index) => (
        <SortableItem key={`item-${index}`} index={index} item={item} />
      )}></List>
  );
});

class SlotAthleteGroupSortableList extends Component<Props, State> {
  state = {
    loading: false
  };

  _onSortEnd = args => {
    const { oldIndex, newIndex } = args;
    if (oldIndex === newIndex) return;
    this.setState(
      {
        loading: true
      },
      () => {
        this.props
          .sortMutation({
            variables: {
              slotId: this.props.slotId,
              newIndex,
              oldIndex
            }
          })
          .finally(() => {
            this.setState({
              loading: false
            });
          });
      }
    );
  };

  render() {
    const { athleteGroups, query } = this.props;

    return (
      <SortableList
        loading={query.loading || this.state.loading}
        items={athleteGroups}
        onSortEnd={this._onSortEnd}
      />
    );
  }
}

export default compose(
  graphql(AthleteGroupsQuery, {
    name: 'query',
    options: (props: Props) => ({
      variables: {
        slotId: props.slotId
      }
    })
  }),
  graphql(SortMutation, {
    name: 'sortMutation',
    options: (props: Props) => ({
      refetchQueries: [
        {
          query: AthleteGroupsQuery,
          variables: {
            slotId: props.slotId
          }
        }
      ],
      variables: {
        slotId: props.slotId
      }
    })
  }),
  withProps(props => ({
    athleteGroups: _.get(props, 'query.athleteGroups', [])
  }))
)(SlotAthleteGroupSortableList);
