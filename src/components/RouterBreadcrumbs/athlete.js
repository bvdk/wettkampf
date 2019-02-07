
import React from 'react';
import _ from 'lodash';
import {compose, graphql} from "react-apollo";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import {mapProps} from "recompose";
import { loader } from 'graphql.macro';
const AthleteQuery = loader("../../graphql/queries/athlete.graphql");

const AthleteBreadcrumb = ({ athlete }) => athlete ? <span>{athlete.lastName}, {athlete.firstName}</span> : null;

export default compose(
  graphql(AthleteQuery, {
    name: 'athleteQuery',
    options: (props) =>{
        return {
            variables: {
                id: _.get(props,'match.params.athleteId'),
            }
        }
    },
  }),
  mapProps((props) => ({
    athlete: _.get(props,'athleteQuery.athlete'),
  }))
)(AthleteBreadcrumb);
