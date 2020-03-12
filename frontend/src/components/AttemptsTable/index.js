// @flow
import React, { Component } from 'react';
import { Checkbox, Table, Tooltip } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import AttemptInlineForm from '../AttemptInlineForm';
import AttemptDisplayLabel from '../AttemptDisplayLabel';
import { shortDisciplines } from '../../constants/disciplines';
import Bold from '../Bold';
import { setSetting } from '../../redux/actions/settings';

type Props = {
  athletes: any[],
  filterParams?: any,
  availableDisciplines: string[],
  attemptCount?: number,
  tableProps?: any,
  onChange?: Function,
  editableAttemptCols?: boolean,
  groupWeightClasses?: boolean,
  highlightFirstAthlete?: boolean,
  settingsKey?: string,
  hiddenCols?: string[]
};

type State = {};

// const defaultSorter = (a, b, key, defaultValue) => {
//   const aValue = _.get(a,key) || defaultValue;
//   const bValue = _.get(b,key) || defaultValue;
//
//   if(aValue < bValue) { return -1; }
//   if(aValue > bValue) { return 1; }
//   return 0;
// }

class AttemptsTable extends Component<Props, State> {
  static defaultProps = {
    attemptCount: 3,
    filterParams: {},
    availableDisciplines: []
  };

  getDisciplineColumns = (availableDisciplines, discipline) => {
    return availableDisciplines.reduce((acc, key) => {
      const dataIndex = `${shortDisciplines[key]}`;

      if (!discipline || key === discipline) {
        for (let i = 0; i < this.props.attemptCount; i += 1) {
          const iDataIndex = `${dataIndex}${i + 1}`;

          acc.push({
            dataIndex: iDataIndex,
            title: iDataIndex,
            width: this.props.editableAttemptCols ? 140 : undefined,
            render: (text, record) => {
              const attempt = _.chain(record)
                .get('attempts')
                .filter({ discipline: key })
                .get(`[${i}]`)
                .value();
              if (this.props.editableAttemptCols) {
                return (
                  <AttemptInlineForm
                    attempt={attempt}
                    onChange={this.props.onChange}
                    athlete={record}
                    discipline={key}
                    attemptId={_.get(attempt, 'id')}
                  />
                );
              }
              return <AttemptDisplayLabel attempt={attempt} />;
            }
          });
        }
      }

      acc.push({
        dataIndex,
        title: dataIndex,
        render: (text, record) => {
          const attempt = _.chain(record)
            .get('bestAttempts')
            .filter({ discipline: key })
            .first()
            .value();

          return <Bold>{_.get(attempt, 'weight', '')}</Bold>; // <AttemptDisplayLabel attempt={attempt}/>
        }
      });

      return acc;
    }, []);
  };

  getDataSource(athleteGroups) {
    const athletes = this.props.athletes.filter(
      athlete => athlete.bodyWeight !== null
    );

    if (!this.props.groupWeightClasses) {
      return athletes;
    }

    return _.chain(athletes)
      .orderBy(a => {
        const group = athleteGroups.find(ag => ag.id === a.athleteGroupId);
        return athleteGroups.indexOf(group);
      })
      .groupBy('athleteGroupId')
      .reduce((result, value, key) => {
        const athleteGroup = value.find(v => v.athleteGroupId);
        const group = athleteGroups.find(
          ag => athleteGroup && ag.id === athleteGroup.athleteGroupId
        );

        const values = _.chain(value)
          .orderBy(
            [
              'resultClass.gender',
              'resultClass.ageClass.sortId',
              'resultClass.weightClass.max',
              'place'
            ],
            ['desc', 'asc', 'asc', 'desc']
          )
          .groupBy('resultClass.id')
          .reduce((result2, value2, key2) => {
            return result2.concat([
              {
                type: 'resultClass',
                id: key2,
                ..._.get(value2, '[0].resultClass')
              },
              ..._.chain(value2)
                .orderBy(['place'])
                .value()
            ]);
          }, []);

        const results = group
          ? [
              {
                type: 'resultClass',
                id: key,
                ...group
              },
              ...values
            ]
          : [...values];

        return result.concat(results);
      }, [])
      .value();
  }

  setHiddenCols = hiddenCols => {
    this.props.setColConfig({
      hiddenCols
    });
  };

  render() {
    const {
      athletes,
      availableDisciplines,
      tableProps,
      filterParams,
      highlightFirstAthlete,
      athleteGroups
    } = this.props;

    const athleteGroupIds = Array.isArray(filterParams.athleteGroupId)
      ? filterParams.athleteGroupId
      : [filterParams.athleteGroupId];

    const filteredAthletes = athletes.filter(athlete => {
      const attempts = athlete.attempts
        .filter(a => a.discipline === filterParams.discipline && a.weight)
        .map((a, i) => ({ ...a, i }))
        .filter(a => !a.done);

      return attempts.length > 0;
    });

    const firstAthleteId = _.get(filteredAthletes, '[0].id');

    let columns = [
      {
        dataIndex: 'place',
        title: 'Pl',
        defaultSortOrder: 'ascend'
      },
      {
        dataIndex: 'name',
        title: 'Name',
        render: (text, record) => {
          if (record.id === firstAthleteId) {
            return (
              <Tooltip title="Dieser Athlet ist an der Reihe">{text}</Tooltip>
            );
          }
          return text;
        }
      },
      {
        dataIndex: 'club',
        title: 'Verein'
      },
      {
        dataIndex: 'resultClass',
        title: 'Wertungsklasse',
        render: (text, record) => _.get(record, 'resultClass.name')
      },
      {
        dataIndex: 'Geb/KG/Los',
        title: 'Geb/KG/Los',
        render: (text, record) =>
          `${record.birthday ? moment(record.birthday).format('YYYY') : '-'}/${
            record.bodyWeight ? record.bodyWeight : '-'
          }/${record.los ? record.los : '-'}`
      },
      ...this.getDisciplineColumns(
        availableDisciplines,
        filterParams.discipline
      ),
      {
        dataIndex: 'total',
        title: 'Total',
        render: text => <Bold>{text}</Bold>
      },
      {
        dataIndex: 'dots',
        title: 'Dots'
      },
      {
        dataIndex: 'points',
        title: 'Punkte',
        render: text => <Bold>{text}</Bold>
      }
    ];

    columns = columns.filter(col => {
      return this.props.hiddenCols.indexOf(col.dataIndex) === -1;
    });

    columns = columns.map((col, index) => {
      if (index === 0) {
        return {
          ...col,
          render: (text, record) => {
            if (record.type === 'resultClass') {
              return {
                children: record.name,
                props: {
                  className: 'resultClassSection',
                  colSpan: columns.length
                }
              };
            }

            return text;
          }
        };
      }

      return {
        ...col,
        render: (text, record) => {
          if (record.type === 'resultClass') {
            return {
              props: {
                children: '',
                colSpan: 0
              }
            };
          }
          return col.render ? col.render(text, record) : text;
        }
      };
    });

    const menu = (
      <div style={{ padding: '6px 0' }}>
        {_.chain(columns)
          .map(col => {
            return {
              text: col.title,
              value: col.dataIndex
            };
          })
          .value()
          .map(item => {
            return (
              <div style={{ margin: '6px 8px' }} key={item.value}>
                <Checkbox
                  checked={!(this.props.hiddenCols.indexOf(item.value) > -1)}
                  onChange={e => {
                    const { checked } = e.target;

                    const hiddenCols = [...this.props.hiddenCols];
                    if (checked) {
                      const index = hiddenCols.indexOf(item.value);
                      if (index > -1) {
                        hiddenCols.splice(index, 1);
                      }
                    } else {
                      const index = hiddenCols.indexOf(item.value);
                      if (index === -1) {
                        hiddenCols.push(item.value);
                      }
                    }

                    this.setHiddenCols(hiddenCols);
                  }}>
                  {item.text}
                </Checkbox>
              </div>
            );
          })}
      </div>
    );
    _.last(columns).filterDropdown = () => menu;

    const dataSource = this.getDataSource(
      athleteGroupIds
        .map(id => athleteGroups.find(ag => ag.id === id))
        .filter(e => e)
    );

    return (
      <Table
        rowKey="id"
        rowClassName={
          highlightFirstAthlete
            ? record =>
                record.id === firstAthleteId ? 'active-athlete-row' : ''
            : undefined
        }
        size="small"
        dataSource={dataSource} // dataSource={dataSource.length ? [_.first(dataSource)] : []}
        columns={columns}
        pagination={false}
        {...tableProps}
      />
    );
  }
}

export default compose(
  connect(
    (state, props) => {
      const colConfig = _.get(
        state,
        `settings.${_.get(props, 'settingsKey', 'attemptsTableColConfig')}`
      );
      return {
        hiddenCols: _.get(colConfig, 'hiddenCols', ['resultClass'])
      };
    },
    (dispatch, props) => {
      return {
        setColConfig: colConfig =>
          dispatch(
            setSetting(
              _.get(props, 'settingsKey', 'attemptsTableColConfig'),
              colConfig
            )
          )
      };
    }
  )
)(AttemptsTable);
