// @flow
import React, {Component} from 'react';
import _ from "lodash";
import {Table} from "antd";
import {withNamespaces} from "react-i18next";
import {compose, graphql} from "react-apollo";
import AttributesInlineForm from "../Form/attributes-inline-form";
import {loader} from "graphql.macro";
import {defaultFilter, defaultOnFilter, defaultSorter} from "../../utils/tableUtils";

const EventAthleteGroupsQuery = loader("../../graphql/queries/eventAthleteGroups.graphql");
const DeleteAthleteGroupMutation = loader("../../graphql/mutations/deleteAthleteGroup.graphql");
const SetAthleteGroupSlotMutation = loader("../../graphql/mutations/setAthleteGroupSlot.graphql");

type Props = {
  hideKeys: boolean,
  eventId: string,
  athleteGroups: any[],
  onClick?: Function,
  editable: boolean,
  deleteAthleteGroupMutation: Function,
  onSelectChange: Function,
  selectionConfig?: any,
  tableProps: any,
};

type State = {

}

class AthleteGroupTable extends Component<Props, State> {

  static defaultProps = {
    hideKeys: [],
  }

  state = {
    selectedRowKeys: [],
  }

  _handleRemove = ({id}) => {

    this.props.deleteAthleteGroupMutation({
      variables: {
        id,
      }
    });

  }

  onSelectionChange = () => {

    if (this.props.onSelectChange){
      this.props.onSelectChange(this.state.selectedRowKeys);
    }

  }

  toggleSelectAll = () => {

    if (this.state.selectedRowKeys.length !== this.props.athleteGroups.length){
      this.setState({
        selectedRowKeys: this.props.athleteGroups.map(item => item.id),
      },this.onSelectionChange);
    }else {
      this.setState({
        selectedRowKeys: [],
      },this.onSelectionChange);
    }

  }

  getRowSelection = () => {

    const { selectedRowKeys } = this.state;
    const { selectionConfig } = this.props;

    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
      onSelectAll: this.toggleSelectAll,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
        },this.onSelectionChange);
      },
      getCheckboxProps: record => ({
        // disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.id,
        value: record.id,
      }),
      ...selectionConfig,
    };

    return rowSelection;

  }

  render() {
    const { tableProps, hideKeys, onSelectChange, athleteGroups, t, onClick, eventId, setAthleteGroupSlotMutation, editable } = this.props;

    const columns = [{
      title: 'Bezeichnung',
      dataIndex: 'name',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => defaultSorter(a, b, 'name'),

      onCell: (record) => ({
        onClick: () => {
          if (onClick){
            onClick(record);
          }
        }
      })
    },
      {
        title: 'Bühne',
        dataIndex: 'slot',
        width: 200,
        filters: defaultFilter('slot.id', 'slot', 'id', 'name', athleteGroups),
        onFilter: defaultOnFilter('slot.id'),
        render: (text, record) => {

          if (editable){
            return <AttributesInlineForm
                values={{
                  slotId: _.get(record,'slotId',null),
                }}
                mutation={setAthleteGroupSlotMutation}
                translateMutationOptions={({slotId})=>({
                  variables: {
                    slotId,
                    athleteGroupId: record.id
                  }
                })}
                attributes={[{
                  index: 'slotId',
                  inputType: 'select',
                  type: 'string',
                  entityType: 'EventSlot',
                  getQueryVariables: () => ({
                    eventId: eventId
                  })
                }]}
                inline/>
          }



          return _.get(record,'slot.name','Keine Angabe')
        }
      },
      {
        title: 'Geschlecht',
        dataIndex: 'gender',
        render: (text) => t(text)
      },{
        title: 'Alterklasse',
        dataIndex: 'ageClass',
        render: (text, record) => _.get(record,'ageClass.name')
      },{
        title: 'Gewichtsklasse',
        dataIndex: 'weightClass',
        render: (text, record) => _.get(record,'weightClass.name')
      },{
        title: 'Athleten',
        sorter: (a, b) => defaultSorter(a, b, 'athleteCount'),
        dataIndex: 'athleteCount'
      },{
        title: 'Aktion',
        dataIndex: 'action',
        render: (text, record) => (
            <a onClick={()=>{this._handleRemove(record)}}>Löschen</a>
        ),
      }
    ].filter(item => hideKeys.indexOf(item.dataIndex)===-1);

    return <Table
        {...tableProps}
        rowKey={'id'}
        rowSelection={onSelectChange ? this.getRowSelection() : undefined}
        columns={columns}
        dataSource={athleteGroups}
    />;
  }
}

export default compose(
    withNamespaces(),
    graphql(SetAthleteGroupSlotMutation,{
      name: 'setAthleteGroupSlotMutation'
    }),
    graphql(DeleteAthleteGroupMutation,{
      name: 'deleteAthleteGroupMutation',
      options: ({eventId}) => ({
        refetchQueries: [{
          query: EventAthleteGroupsQuery,
          variables: {
            eventId,
          }
        }]
      })
    })
)(AthleteGroupTable);
