// @flow
import React, { Component } from 'react';
import { loader } from 'graphql.macro';
import { compose, graphql } from 'react-apollo';
import _ from 'lodash';
import { withProps } from 'recompose';
import { Button, Icon, Modal } from 'antd';
import { withNamespaces } from 'react-i18next';
import Toolbar from '../Toolbar';
import waitWhileLoading from '../../hoc/waitWhileLoading';
import EventAthletePointsCalcButton from '../EventAthletePointsCalcButton';
import Bold from '../Bold';
import SlotAthleteGroupActivationForm from '../SlotAthleteGroupActivationForm';

const EventAttemptsQuery = loader(
  '../../graphql/queries/nextSlotAthletes.graphql'
);

type Props = {
  slotId: string,
  highlightFirstAthlete?: boolean
};

type State = {
  showModal: boolean
};

class OrderedEventAthletes extends Component<Props, State> {
  state = {
    showModal: false
  };

  _hideModal = () =>
    this.setState({
      showModal: false
    });

  renderHeader() {
    const { slot, t, discipline, activeAthleteGroup } = this.props;

    if (!activeAthleteGroup || !discipline) {
      let button = null;
      const onClick = () => this.setState({ showModal: true });
      if (!activeAthleteGroup) {
        button = (
          <Button onClick={onClick} type="danger">
            Keine aktive Startgruppe
          </Button>
        );
      } else if (!discipline) {
        button = (
          <Button onClick={onClick} type="danger">
            Keine aktive Disziplin
          </Button>
        );
      }
      return <div>{button}</div>;
    }

    return (
      <div className="link" onClick={() => this.setState({ showModal: true })}>
        <Bold>{slot.name}:</Bold>{' '}
        <span>{_.get(activeAthleteGroup, 'name')}</span> -{' '}
        <span>{t(discipline)}</span>
      </div>
    );
  }

  render() {
    const { athletes, highlightFirstAthlete, discipline } = this.props;
    const style = { width: '25%', padding: 8 };

    return (
      <div>
        <Modal
          title={'Aktive Startgruppe und Disziplin ändern'}
          visible={this.state.showModal}
          onCancel={this._hideModal}
          onOk={this._hideModal}>
          <SlotAthleteGroupActivationForm slotId={this.props.slotId} />
        </Modal>

        <div className="ant-table-wrapper">
          <div className="ant-spin-nested-loading">
            <div className="ant-spin-container">
              <div className="ant-table ant-table-small ant-table-empty ant-table-scroll-position-left">
                <div className="ant-table-title">{this.renderHeader()}</div>
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
                          maxHeight: 'calc(100vh - 300px)'
                        }}>
                        {athletes.map((athlet, index) => {
                          const indexColumnValue =
                            highlightFirstAthlete && index === 0 ? (
                              <Icon type={'right'} />
                            ) : (
                              index + 1
                            );

                          let weight = _.chain(athlet)
                            .get('nextAttempts')
                            .filter({
                              discipline
                            })
                            .first()
                            .get('weight')
                            .value();
                          if (weight) {
                            weight = `${weight} kg`;
                          }

                          let i = _.chain(athlet)
                            .get('nextAttempts[0].index')
                            .value();
                          if (i < 3) {
                            i += 1;
                          }

                          // active-athlete-row
                          return (
                            <tr className="ant-table-row ant-table-row-level-0">
                              <td style={style}>{indexColumnValue}</td>
                              <td style={style}>{athlet.name}</td>
                              <td style={style}>{weight}</td>
                              <td style={style}>{i}</td>
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
                      renderLeft={() => <span>{athletes.length} Athleten</span>}
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

export default compose(
  graphql(EventAttemptsQuery, {
    name: 'nextSlotAthletesQuery',
    options: (props: Props) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: {
          slotId: props.slotId
        }
      };
    }
  }),
  waitWhileLoading('nextSlotAthletesQuery'),
  withProps(props => ({
    loading: _.get(props, 'nextSlotAthletesQuery.loading', false),
    slotId: props.slotId,
    onAthleteClick: props.onAthleteClick,
    slot: _.get(props, 'nextSlotAthletesQuery.slot'),
    eventId: _.get(props, 'nextSlotAthletesQuery.slot.eventId'),
    discipline: _.get(props, 'nextSlotAthletesQuery.slot.activeDiscipline'),
    activeAthleteGroup: _.get(
      props,
      'nextSlotAthletesQuery.slot.activeAthleteGroup'
    ),
    athletes: _.get(props, 'nextSlotAthletesQuery.slot.nextAthletes', []).map(
      (item, index) => ({
        ...item,
        '#': index + 1
      })
    )
  })),
  withNamespaces()
)(OrderedEventAthletes);
