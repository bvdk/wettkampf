// @flow
import React, { Component } from 'react';
import _ from "lodash";
import AttributesInlineForm from "../Form/attributes-inline-form";
import {compose, graphql} from "react-apollo";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import {loader} from "graphql.macro";

const AthleteGroupsQuery = loader("../../graphql/queries/slotAthleteGroups.graphql");
const Query = loader("../../graphql/queries/slotForm.graphql");
const Mutation = loader("../../graphql/mutations/updateSlot.graphql");

type Props = {
    mutation: Function,
    onUpdate: Function,
    slotId: string,
};

type State = {

}

class SlotAthleteGroupActivationForm extends Component<Props, State> {

  render() {
    const {
        slotId,
        mutation,
        query
    } = this.props;

    const slot = _.get(query,'slot', {});

    return <AttributesInlineForm
        useSubmit={false}
        onChange={(data)=>{

            mutation({
                refetchQueries: [{
                    query: AthleteGroupsQuery,
                    variables: {
                        slotId,
                    }
                }],
                variables: {
                    slotId,
                    data: {
                        activeDiscipline: data.activeDiscipline ? data.activeDiscipline : null,
                        activeAthleteGroupId: data.activeAthleteGroupId ? data.activeAthleteGroupId: null
                    }
                }
            })
        }}
        values={{
            activeDiscipline: slot.activeDiscipline ? slot.activeDiscipline : undefined,
            activeAthleteGroupId: slot.activeAthleteGroupId ? slot.activeAthleteGroupId : undefined
        }}
        attributes={[{
            index: 'activeAthleteGroupId',
            inputType: 'select',
            type: 'string',
            name: 'Aktive Startgruppe',
            entityType: 'SlotAthleteGroup',
            getQueryVariables: () => ({
                slotId
            })
        },{
            index: 'activeDiscipline',
            inputType: 'select',
            type: 'string',
            name: 'Aktive Disziplin',
            localFilter: (item) => {
                return _.get(item,'props.value') !== 'POWERLIFTING'
            },
            entityType: 'enum',
            enumType: 'Discipline',
        }]}
    />;
  }
}

export default compose(
    graphql(Query,{
        name: 'query',
        options: (props: Props) => ({

            variables: {
                id: props.slotId
            }
        })
    }),
    waitWhileLoading('query'),
    graphql(Mutation, {
        name: 'mutation',
    }),
)(SlotAthleteGroupActivationForm);

