// @flow
import React, { Component } from 'react';
import {Empty, Table, Input, Button, Icon} from "antd";
import _ from "lodash";
import {withNamespaces} from "react-i18next";
import DangerLabel from "./../DangerLabel";
import {defaultFilter, defaultOnFilter, defaultSorter} from "../../utils/tableUtils";

type Props = {
  athletes: any[],
  onSelectChange?: Function,
  onAthleteClick?: Function,
  hideKeys?: [],
  tableProps?: any,
  showRowNumber?: boolean,
  selectedRowIds?: string[],
};

type State = {
  selectedRowKeys: string[],
  filteredDataSourceIds: string[],
}

class AthletesTable extends Component<Props, State> {
  static defaultProps = {
    hideKeys: [],
  }

  state = {
    selectedRowKeys: [],
    searchText: '',
    filteredDataSourceIds: this.props.athletes.map(item => item.id),
  }

  toggleSelectAll = () => {
    if (this.state.selectedRowKeys.length !== this.state.filteredDataSourceIds.length){
      this.setState({
        selectedRowKeys: this.state.filteredDataSourceIds,
      },this.onSelectionChange);
    }else {
      this.setState({
        selectedRowKeys: [],
      },this.onSelectionChange);
    }

  }

  onSelectionChange = () => {

    if (this.props.onSelectChange){
      this.props.onSelectChange(this.state.selectedRowKeys);
    }

  }

  getRowSelection = () => {


    const selectedRowKeys = this.props.selectedRowIds || this.state.selectedRowKeys;

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
      })
    };

    return rowSelection;

  }

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = (clearFilters, key) => {
    clearFilters();
    this.setState({ [key]: '' });
  }

  getColumns(athletes) {

    const { t, onAthleteClick, hideKeys } = this.props;

    const columns = [{
      title: 'Name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (text, record) => `${record.lastName}, ${record.firstName}`,
      sorter: (a, b) => defaultSorter(a, b, 'lastName'),
      filterDropdown: ({
                         setSelectedKeys, selectedKeys, confirm, clearFilters,
                       }) => (
          <div style={{ padding: 8 }}>
            <Input
                ref={node => { this.searchInput = node; }}
                placeholder={`Namen suchen`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                style={{ width: 200, marginBottom: 8, display: 'block' }}
            />
            <Button
                type="primary"
                onClick={() => this.handleSearch(selectedKeys, confirm)}
                icon="search"
                size="small"
                style={{ width: 90, marginRight: 8 }}
            >
              Suchen
            </Button>
            <Button
                onClick={() => this.handleReset(clearFilters, "searchText")}
                size="small"
                style={{ width: 90 }}
            >
              Entfernen
            </Button>
          </div>
      ),
      filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record["lastName"].toString().toLowerCase().includes(value.toLowerCase() ) || record["firstName"].toString().toLowerCase().includes(value.toLowerCase() ),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => this.searchInput.select());
        }
      },
    }, {
      title: 'Geschlecht',
      dataIndex: 'gender',
      key: 'gender',
      filters: [{
        text: 'Männer',
        value: 'MALE',
      }, {
        text: 'Frauen',
        value: 'FEMALE',
      }],
      onFilter: (value, record) => record.gender === value,
      filterMultiple: false,
      render: (text) => t(text),
      sorter: (a, b) => defaultSorter(a, b, 'gender')
    }, {
      title: 'Alter',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => defaultSorter(a, b, 'age')
    },{
      title: 'Altersklasse',
      dataIndex: 'ageClass',
      key: 'ageClassId',
      filters: defaultFilter('ageClass.id', 'ageClass', 'id', 'name', athletes),
      onFilter: (value, record) => {
        let arrVal = value;
        if (!Array.isArray(arrVal)){
          arrVal = [value];
        }
        return arrVal.indexOf(_.get(record,'ageClass.id')) !== -1;
      },
      render: (text, record) => _.get(record, 'ageClass.name'),
      sorter: (a, b) => defaultSorter(a, b, 'ageClass.name')
    }, {
      title: 'Gewicht',
      dataIndex: 'bodyWeight',
      key: 'weight',
      render: (text) => text ? <span>{text} kg</span> : null,
      sorter: (a, b) => defaultSorter(a, b, 'weight')
    }, {
      title: 'Gewichtsklasse',
      dataIndex: 'weightClass',
      key: 'weightClass',
      filters: defaultFilter('weightClass.id', 'weightClass', 'id', 'name', athletes),
      onFilter: defaultOnFilter('weightClass.id'),
      render: (text, record) => _.get(record, 'weightClass.name'),
      sorter: (a, b) => defaultSorter(a, b, 'weightClass.name')
    },
      {
        title: 'Wertungsgruppe',
        dataIndex: 'resultClass.name',
        key: 'resultClass.name',
        render: (text, record) => record.resultClass ? record.resultClass.name : <DangerLabel>Ungültige Wertungsgruppe</DangerLabel>,
        sorter: (a, b) => defaultSorter(a, b, 'resultClass.name'),
        filters: _.chain(athletes)
          .groupBy('resultClass.id')
          .map((athletes)=>{
            const athlete = _.first(athletes);
            const resultGroup = _.get(athlete,'resultClass');
            if (resultGroup){
              return {
                text: resultGroup.name,
                value: resultGroup.id,
              }
            }
            return null
          })
          .filter((item)=> item)
          .orderBy(["text","asc"])
          .value(),
        onFilter: (value, record) => {
          let arrVal = value;
          if (!Array.isArray(arrVal)){
            arrVal = [value];
          }
          return arrVal.indexOf(_.get(record,'resultClass.id')) !== -1;
        },
      },
      {
      title: 'Bühne',
      dataIndex: 'athleteGroup.Slot.name',
      key: 'athleteGroup.Slot.name',
        filters: defaultFilter('Slot.id', 'slot', 'id', 'name', athletes),
        onFilter: defaultOnFilter('Slot.id'),
      // filters: [{
      //   text: 'Ohne Zuteilung',
      //   value: false,
      // },{
      //   text: 'Zugeteilte Athleten',
      //   value: true,
      // }],
      // filterMultiple: false,
      // onFilter: (value, record) => {
      //   const boolValue = value === "true" ? true : value === "false" ? false : null;
      //   return boolValue ? !!_.get(record,'Slot') : !_.get(record,'Slot');
      // },
      render: (text, record) => _.get(record,'slot') ? _.get(record,'Slot.name') : <DangerLabel>Keine Bühne zugeweisen</DangerLabel>,
      sorter: (a, b) => defaultSorter(a, b, 'Slot.name')
    }
    ]
        .filter( item => hideKeys.indexOf(item.dataIndex) === -1)
        .map((item) => ({
      ...item,
      onCell: (record) => ({
        onClick: onAthleteClick ? () => onAthleteClick(record) : undefined,
      })
    }));


    if (this.props.showRowNumber){
      columns.unshift({
        title: '#',
        dataIndex: 'number',
        render: (text, item, index) => `${_.indexOf(this.state.filteredDataSourceIds,item.id)+1}`
      })
    }

    return columns;
  }


  render() {
    const { athletes,  onSelectChange, tableProps } = this.props;


    return <div>
      <Table
        rowKey={'id'}
        rowSelection={onSelectChange ? this.getRowSelection() : undefined}
        columns={this.getColumns(athletes)}
        dataSource={athletes}
        onChange={(pagination, filters, sorter, { currentDataSource })=>{
          this.setState({
            filteredDataSourceIds: currentDataSource.map(item => item.id),
          })
        }}
        locale={{
          emptyText: <Empty description={'Keine Athleten'} />
        }}
        {...tableProps}
    />
        </div>
  }


}

export default withNamespaces()(AthletesTable);
