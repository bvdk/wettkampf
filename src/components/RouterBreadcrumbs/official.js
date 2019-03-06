import React from 'react';
import _ from 'lodash';
import {compose, graphql} from "react-apollo";
import {mapProps} from "recompose";
import {loader} from 'graphql.macro';

const OfficialQuery = loader("../../graphql/queries/officialName.graphql");

const OfficialBreadcrumb = ({ official }) => official ? <span>{official.lastName}, {official.firstName}</span> : null;

export default compose(
  graphql(OfficialQuery, {
    name: 'officialQuery',
    options: (props) =>{
        return {
            variables: {
                id: _.get(props,'match.params.officialId'),
            }
        }
    },
  }),
  mapProps((props) => ({
    official: _.get(props,'officialQuery.official'),
  }))
)(OfficialBreadcrumb);
