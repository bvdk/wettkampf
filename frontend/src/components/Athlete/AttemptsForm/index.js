// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { compose, graphql } from 'react-apollo';
import { withNamespaces } from 'react-i18next';
import { loader } from 'graphql.macro';
import { withProps } from 'recompose';
import waitWhileLoading from '../../../hoc/waitWhileLoading';
import { shortDisciplines } from '../../../constants/disciplines';
import AttributesInlineForm from '../../Form/attributes-inline-form';

const AthleteQuery = loader('../../../graphql/queries/athleteAttempts.graphql');
const EventDisciplinesQuery = loader(
  '../../../graphql/queries/eventDisciplines.graphql'
);
const UpdateAttemptMutation = loader(
  '../../../graphql/mutations/updateAttempt.graphql'
);
const CreateAttemptMutation = loader(
  '../../../graphql/mutations/createAttempt.graphql'
);
const AutoCalcAthletePointsMutation = loader(
  '../../../graphql/mutations/autoCalcAthletePoints.graphql'
);

type Props = {
  discipline?: string,
  athleteId: string,
  eventId: string,
  updateAttemptMutation: Function,
  createAttemptMutation: Function
};

const attemptCount = 3;

class AthleteAttemptsForm extends Component<Props, {}> {
  render() {
    const {
      athleteQuery,
      disciplines,
      updateAttemptMutation,
      createAttemptMutation,
      autoCalcAthletePointsMutation
    } = this.props;

    const athlete = _.get(athleteQuery, 'athlete');
    const attributes = [];
    disciplines.forEach(discipline => {
      const dataIndex = `${shortDisciplines[discipline]}`;
      for (let i = 1; i <= attemptCount; i++) {
        const attempt = _.chain(athlete)
          .get(`attempts`)
          .filter({ discipline })
          .get(`[${i - 1}]`)
          .value();
        attributes.push({
          index: `${dataIndex}_${i + 100}`,
          name: `Versuch ${i}`,
          inputType: 'attempt',
          type: 'object',
          value: {
            ...attempt,
            discipline
          }
        });
      }
    });

    return (
      <AttributesInlineForm
        attributes={attributes}
        useSubmit
        mutation={options => {
          const updateAttributes = _.get(options, 'variables.attributes');
          const promises = Object.keys(updateAttributes).map(key => {
            const updateAttempt = updateAttributes[key];
            const input = {
              weight: updateAttempt.weight,
              valid: updateAttempt.valid,
              done: updateAttempt.done
            };
            if (updateAttempt.id) {
              return updateAttemptMutation({
                variables: { attemptId: updateAttempt.id, data: input }
              });
            }
            return createAttemptMutation({
              refetchQueries: [
                {
                  query: AthleteQuery,
                  variables: {
                    id: athlete.id
                  }
                }
              ],
              variables: {
                athleteId: athlete.id,
                data: input,
                discipline: updateAttempt.discipline
              }
            });
          });

          return Promise.all(promises).then(() =>
            autoCalcAthletePointsMutation({ variables: { id: athlete.id } })
          );
        }}
      />
    );
  }
}

export default compose(
  graphql(AthleteQuery, {
    name: 'athleteQuery',
    options: (props: Props) => ({
      variables: {
        id: props.athleteId
      }
    })
  }),
  waitWhileLoading('athleteQuery'),
  graphql(EventDisciplinesQuery, {
    name: 'eventDisciplinesQuery',
    skip: props => props.discipline,
    options: (props: Props) => ({
      variables: {
        id: props.eventId
      }
    })
  }),
  waitWhileLoading('eventDisciplinesQuery', null, { optional: true }),
  graphql(UpdateAttemptMutation, {
    name: 'updateAttemptMutation'
  }),
  graphql(CreateAttemptMutation, {
    name: 'createAttemptMutation'
  }),
  graphql(AutoCalcAthletePointsMutation, {
    name: 'autoCalcAthletePointsMutation'
  }),
  withNamespaces(),
  withProps(props => ({
    disciplines: _.get(
      props,
      'eventDisciplinesQuery.event.availableDisciplines'
    ) || [_.get(props, 'discipline')]
  }))
)(AthleteAttemptsForm);
