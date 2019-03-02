// @flow
import React, { Component } from 'react';
import {Table} from "antd";
import _ from 'lodash';
import moment from "moment";
import AttemptInlineForm from "./../AttemptInlineForm";
import AttemptDisplayLabel from "../AttemptDisplayLabel";
import {shortDisciplines} from "../../constants/disciplines";


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

}





class AttemptsTable extends Component<Props, State> {

  static defaultProps = {
    attemptCount: 3,
    filterParams: {},
    availableDisciplines: [],
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

    const columns = [{
      dataIndex: 'place',
      title: 'Pl'
    },{
      dataIndex: 'name',
      title: 'Name'
    },{
      dataIndex: 'club',
      title: 'Verein'
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
      }];

    const dataSource = _.chain(athletes)
      .map(item => ({
        ...item,
          __sortKey: _.get(item,'nextAttempts[0]') ? `${_.get(item,'nextAttempts[0].index')}-${100000+_.get(item,'nextAttempts[0].weight')}` : "999999",
      }))
      .orderBy(['__sortKey'],['asc'])
      .value()

    return <div>
      <Table
        rowKey={"id"}
        size={'small'}
        dataSource={dataSource}// dataSource={dataSource.length ? [_.first(dataSource)] : []}
        columns={columns}
        {...tableProps}
      />
    </div>;
  }
}

export default AttemptsTable;
