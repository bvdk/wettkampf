// @flow
import React, { Component } from 'react';
import {Button, Checkbox, Dropdown, Icon, Menu, Table} from "antd";
import _ from 'lodash';
import moment from "moment";
import AttemptInlineForm from "./../AttemptInlineForm";
import AttemptDisplayLabel from "../AttemptDisplayLabel";
import {shortDisciplines} from "../../constants/disciplines";
import Toolbar from "../Toolbar";


type Props = {
  athletes: any[],
  filterParams?: any,
  availableDisciplines: string[],
  attemptCount?: number,
  tableProps?: any,
  onChange?: Function,
  editableAttemptCols?: boolean,
};

type State = {
  hiddenCols: string[],
}


const defaultSorter = (a, b, key, defaultValue) => {
  const aValue = _.get(a,key) || defaultValue;
  const bValue = _.get(b,key) || defaultValue;

  if(aValue < bValue) { return -1; }
  if(aValue > bValue) { return 1; }
  return 0;
}

class AttemptsTable extends Component<Props, State> {

  static defaultProps = {
    attemptCount: 3,
    filterParams: {},
    availableDisciplines: [],
  }

  state = {
    hiddenCols: []
  }

  getDisciplineColumns = (availableDisciplines, discipline) => {
    return availableDisciplines.reduce((acc, key) => {
      const dataIndex = `${shortDisciplines[key]}`;

      if (!discipline || key === discipline){
        for (let i=0; i<this.props.attemptCount; i++){
          let iDataIndex = `${dataIndex}${i+1}`;

          acc.push({
            dataIndex: iDataIndex,
            title: iDataIndex,
            width: this.props.editableAttemptCols ? 140: undefined,
            render: (text, record) => {
              const attempt = _.chain(record)
                .get("attempts")
                .filter({discipline: key})
                .get(`[${i}]`)
                .value();
              if (this.props.editableAttemptCols){
                return <AttemptInlineForm attempt={attempt} onChange={this.props.onChange} athlete={record} discipline={key} attemptId={_.get(attempt,'id')}/>
              }else {
                return <AttemptDisplayLabel attempt={attempt}/>
              }
            }
          })
        }
      }

      acc.push({
        dataIndex: dataIndex,
        title: dataIndex,
        render: (text, record) => {
          const attempt = _.chain(record)
            .get("bestAttempts")
            .filter({discipline: key})
            .first()
            .value();

          return <span>{_.get(attempt,'weight','')}</span>//<AttemptDisplayLabel attempt={attempt}/>
        }
      })

      return acc;
    },[]);
  }

  render() {
    const { athletes, availableDisciplines, tableProps, filterParams} = this.props;

    let columns = [{
      dataIndex: 'place',
      title: 'Pl',
      sorter: (a, b) => {
        return defaultSorter(a, b, 'place',9999)
      },
      defaultSortOrder: 'ascend',
    },{
      dataIndex: 'name',
      title: 'Name'
    },{
      dataIndex: 'club',
      title: 'Verein'
    },{
      dataIndex: 'resultClass.name',
      title: 'Wertungsklasse',
      render: (text, record) => _.get(record,'resultClass.name')
    },{
      dataIndex: 'Geb/KG/Los',
      title: 'Geb/KG/Los',
      render: (text, record) => `${record.birthday ? moment(record.birthday).format('YYYY') : '-'}/${record.bodyWeight ? record.bodyWeight : '-' }/${record.los ? record.los : '-' }`
    },
      ...this.getDisciplineColumns(availableDisciplines, filterParams.discipline),
      {
        dataIndex: 'total',
        title: 'Total',
      },{
        dataIndex: 'wilks',
        title: 'Wilks',
      },{
        dataIndex: 'points',
        title: 'Punkte',
      }]

    const menu =  <div style={{padding: '6px 0'}}>
      {
        _.chain(columns)
          .map((col)=>{
            return {
              text: col.title,
              value: col.dataIndex,
            }
          })
          .value().map((item)=>{

          return <div style={{margin: '6px 8px'}} key={item.value}><Checkbox checked={!(this.state.hiddenCols.indexOf(item.value)>-1)} onChange={(e) => {

            const checked = e.target.checked;

            let hiddenCols = [...this.state.hiddenCols];
            if (checked){
              const index = hiddenCols.indexOf(item.value);
              if (index > -1) {
                hiddenCols.splice(index, 1);
              }
            }else {
              const index = hiddenCols.indexOf(item.value);
              if (index === -1) {
                hiddenCols.push(item.value);
              }
            }

            this.setState({
              hiddenCols
            })

          }}>{item.text}</Checkbox></div>

        })
      }
    </div>

    columns = columns.filter((col)=>{
        return this.state.hiddenCols.indexOf(col.dataIndex) === -1
    });


    _.last(columns).filterDropdown = () => menu;

    return <div>
      <Table
        rowKey={"id"}
        size={'small'}
        dataSource={athletes}// dataSource={dataSource.length ? [_.first(dataSource)] : []}
        columns={columns}
        pagination={false}
        {...tableProps}
      />
    </div>;
  }
}

export default AttemptsTable;
