
import React from 'react';
import _ from 'lodash';
import {compose, graphql} from "react-apollo";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import {mapProps} from "recompose";
import { loader } from 'graphql.macro';
const Query = loader("../../graphql/queries/athleteGroupName.graphql");

const AthleteBreadcrumb = ({ name }) => name ? <span>{name}</span> : 'Startgruppe';

export default compose(
  graphql(Query, {
    name: 'query',
    options: (props) =>{
        return {
            variables: {
                id: _.get(props,'match.params.athleteGroupId'),
            }
        }
    },
  }),
  mapProps((props) => ({
    name: _.get(props,'query.athleteGroup.name'),
  }))
)(AthleteBreadcrumb);
