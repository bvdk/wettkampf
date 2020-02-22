// @flow
import React, { Component } from 'react';
import { loader } from 'graphql.macro';
import { compose, graphql } from 'react-apollo';
import _ from 'lodash';
import { withProps } from 'recompose';
import { Icon } from 'antd';
import { withNamespaces } from 'react-i18next';
import Toolbar from '../Toolbar';
import waitWhileLoading from '../../hoc/waitWhileLoading';
import EventAthletePointsCalcButton from '../Event/AthletePointsCalcButton';

const EventAttemptsQuery = loader(
  '../../graphql/queries/nextSlotAthletes.graphql'
);

type Props = {
  slotId: string,
  highlightFirstAthlete?: boolean
};

class OrderedEventAthletes extends Component<Props, {}> {
  render() {
    const { athletes, highlightFirstAthlete, filterParams } = this.props;
    const style = { width: '25%', padding: 8 };

    const athleteGroupIds = Array.isArray(filterParams.athleteGroupId)
      ? filterParams.athleteGroupId
      : [filterParams.athleteGroupId];

    const groupedAthletes = _.groupBy(athletes, 'athleteGroupId');
    const athleteHelper = {};
    const athletesData = athleteGroupIds.flatMap(id => {
      if (!groupedAthletes[id]) {
        return [];
      }
      return groupedAthletes[id]
        .flatMap(athlete => {
          const attempts = athlete.attempts
            .filter(a => a.discipline === filterParams.discipline && a.weight)
            .map((a, i) => ({ ...a, i }))
            .filter(a => !a.done);
          if (athleteHelper[athlete.id] === undefined) {
            athleteHelper[athlete.id] = 0;
          } else {
            athleteHelper[athlete.id] += 1;
          }

          const attempt = attempts[athleteHelper[athlete.id]];

          if (attempt && attempt.done) {
            return undefined;
          }

          return attempts.map(a => ({
            ...athlete,
            attempts,
            attempt: a,
            v: (a.i % 3) + 1,
            i: a.i
          }));
        })
        .filter(e => e)
        .sort((a, b) => {
          const attemptA = a.attempt;
          const attemptB = b.attempt;

          const max = Number.MAX_VALUE;

          const weightA = attemptA && attemptA.weight ? attemptA.weight : max;
          const weightB = attemptB && attemptB.weight ? attemptB.weight : max;

          if (weightA === weightB) {
            return a.los - b.los;
          }

          return weightA - weightB;
        })
        .sort((a, b) => a.i - b.i);
    });

    return (
      <div>
        <div className="ant-table-wrapper">
          <div className="ant-spin-nested-loading">
            <div className="ant-spin-container">
              <div className="ant-table ant-table-small ant-table-empty ant-table-scroll-position-left">
                <div className="ant-table-content">
                  <div
                    className="ant-table-body"
                    style={{ overflowX: 'scroll', margin: 0 }}>
                    <div
                      className="ant-table-thead border-bottom"
                      style={{ display: 'flex' }}>
                      <div style={style}>
                        <span className="ant-table-header-column">
                          <div>
                            <span className="ant-table-column-title">#</span>
                            <span className="ant-table-column-sorter"></span>
                          </div>
                        </span>
                      </div>
                      <div style={style}>
                        <span className="ant-table-header-column">
                          <div>
                            <span className="ant-table-column-title">Name</span>
                            <span className="ant-table-column-sorter"></span>
                          </div>
                        </span>
                      </div>
                      <div style={style}>
                        <span className="ant-table-header-column">
                          <div>
                            <span className="ant-table-column-title">
                              Gewicht
                            </span>
                            <span className="ant-table-column-sorter"></span>
                          </div>
                        </span>
                      </div>
                      <div style={style}>
                        <span className="ant-table-header-column">
                          <div>
                            <span className="ant-table-column-title">V.</span>
                            <span className="ant-table-column-sorter"></span>
                          </div>
                        </span>
                      </div>
                    </div>

                    <table style={{ width: '100%' }}>
                      <tbody
                        className="ant-table-tbody"
                        style={{
                          display: 'block',
                          overflowY: 'scroll',
                          maxHeight: 'calc(100vh - 250px)'
                        }}>
                        {athletesData.map((athlete, index) => {
                          const { attempt, v } = athlete;
                          const indexColumnValue =
                            highlightFirstAthlete && index === 0 ? (
                              <Icon type="right" />
                            ) : (
                              index + 1
                            );

                          let weight = '';
                          if (attempt) {
                            if (attempt.weight) {
                              weight = `${attempt.weight} kg`;
                            }
                          }

                          return (
                            <tr
                              key={indexColumnValue}
                              className="ant-table-row ant-table-row-level-0">
                              <td style={style}>{indexColumnValue}</td>
                              <td style={style}>{athlete.name}</td>
                              <td style={style}>{weight}</td>
                              <td style={style}>{v}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {athletes.length === 0 ? (
                    <div className="ant-table-placeholder">
                      <div className="ant-empty ant-empty-normal">
                        <div className="ant-empty-image">
                          <svg
                            width="64"
                            height="41"
                            viewBox="0 0 64 41"
                            xmlns="http://www.w3.org/2000/svg">
                            <g
                              transform="translate(0 1)"
                              fill="none"
                              fillRule="evenodd">
                              <ellipse
                                fill="#F5F5F5"
                                cx="32"
                                cy="33"
                                rx="32"
                                ry="7"></ellipse>
                              <g fillRule="nonzero" stroke="#D9D9D9">
                                <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                                <path
                                  d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                                  fill="#FAFAFA"></path>
                              </g>
                            </g>
                          </svg>
                        </div>
                        <p className="ant-empty-description">Keine Daten</p>
                      </div>
                    </div>
                  ) : null}
                  <div className="ant-table-footer">
                    <Toolbar
                      style={{ padding: 0 }}
                      renderLeft={() => (
                        <span>{athletesData.length} Athleten</span>
                      )}
                      renderRight={() => (
                        <EventAthletePointsCalcButton
                          slotId={this.props.slotId}
                          eventId={this.props.eventId}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const getFilterParams = filterParams => {
  const tmp = [];

  if (filterParams.athleteGroupId) {
    tmp.push({
      value: filterParams.athleteGroupId,
      index: 'athleteGroupId'
    });
  }

  if (filterParams.slotId) {
    tmp.push({
      value: filterParams.slotId,
      index: 'slotId'
    });
  }
  return tmp.length ? tmp : null;
};

export default compose(
  graphql(EventAttemptsQuery, {
    name: 'nextSlotAthletesQuery',
    options: (props: Props) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          slotId: props.slotId,
          filters: getFilterParams(props.filterParams)
        }
      };
    }
  }),
  waitWhileLoading('nextSlotAthletesQuery'),
  withProps(props => ({
    ...props,
    loading: _.get(props, 'nextSlotAthletesQuery.loading', false),
    eventId: _.get(props, 'nextSlotAthletesQuery.slot.eventId'),
    athletes: _.get(props, 'nextSlotAthletesQuery.slot.nextAthletes', []).map(
      (item, index) => ({
        ...item,
        attempts: props.availableDisciplines.flatMap(discipline =>
          item.attempts.filter(a => a.discipline === discipline)
        ),
        '#': index + 1
      })
    )
  })),
  withNamespaces()
)(OrderedEventAthletes);
