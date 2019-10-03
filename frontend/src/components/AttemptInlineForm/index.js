// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { compose, graphql } from 'react-apollo';
import { loader } from 'graphql.macro';
import { withProps } from 'recompose';
import AttributesInlineForm from '../Form/attributes-inline-form';

type Props = {
  attemptId?: string,
  athlete: any,
  attempt: any,
  onChange?: Function
};

type State = {
  attemptId: string
};

const AttemptQuery = loader('../../graphql/queries/attempt.graphql');
const AthleteAttemptsQuery = loader(
  '../../graphql/queries/athleteAttempts.graphql'
);
const AddAttemptMutation = loader(
  '../../graphql/mutations/createAttempt.graphql'
);
const UpdateAttemptMutation = loader(
  '../../graphql/mutations/updateAttempt.graphql'
);

class AttemptInlineForm extends Component<Props, State> {
  state = {
    attemptId: null,
    attempt: null
  };

  render() {
    const {
      athlete,
      discipline,
      updateAttemptMutation,
      addAttemptMutation
    } = this.props;
    const attemptId = this.props.attemptId || this.state.attemptId;
    const attempt = this.props.attempt || this.state.attempt;

    return (
      <AttributesInlineForm
        values={{ attempt }}
        mutation={
          attemptId
            ? updateAttemptMutation
            : options => {
                return addAttemptMutation(options).then(res => {
                  this.setState({
                    attemptId: _.get(res, 'data.createAttempt.id')
                    // attempt: _.get(res,'data.createAttempt'),
                  });
                  return res;
                });
              }
        }
        onSubmit={res => {
          console.log('onSubmit', res);
          this.props.onChange(res);
        }}
        translateMutationOptions={({ attempt }) => {
          return {
            variables: {
              attemptId,
              discipline,
              athleteId: athlete.id,
              data: attempt
            },
            refetchQueries: [
              {
                query: AthleteAttemptsQuery,
                variables: {
                  id: athlete.id
                }
              }
            ]
          };
        }}
        attributes={[
          {
            index: 'attempt',
            inputType: 'attempt',
            type: 'object'
          }
        ]}
        inline
      />
    );
  }
}

export default compose(
  graphql(AttemptQuery, {
    name: 'attemptQuery',
    skip: props => props.attempt || !props.attemptId,
    options: props => ({
      fetchPolicy: 'cache-first',
      variables: {
        id: props.attemptId
      }
    })
  }),
  graphql(AddAttemptMutation, {
    name: 'addAttemptMutation'
  }),
  graphql(UpdateAttemptMutation, {
    name: 'updateAttemptMutation'
  }),
  withProps(props => ({
    attempt: _.get(props, 'attempt') || _.get(props, 'attemptQuery.attempt')
  })),
  withProps(props => ({
    attempt: _.get(props, 'attempt')
      ? {
          weight: _.get(props, 'attempt.weight', null),
          done: _.get(props, 'attempt.done', false),
          resign: _.get(props, 'attempt.resign', false),
          valid: _.get(props, 'attempt.valid', false)
        }
      : null
  }))
)(AttemptInlineForm);
