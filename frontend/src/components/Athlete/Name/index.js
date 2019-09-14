import React from 'react';
import _ from 'lodash'
import {loader} from "graphql.macro";
import {graphql, compose} from "react-apollo";


const AthleteQuery = loader("../../graphql/queries/athleteName.graphql");

export default compose(
  graphql(AthleteQuery, {
    name: 'athleteQuery',
    options: (props: Props) =>({
      variables: {
        id: props.athleteId,
      }
    }),
  }),
)((props)=>{
  return <span>{_.get(props,'athleteQuery.athlete.name')}</span>
})
