import React from 'react';
import _ from 'lodash';
import {compose, graphql} from "react-apollo";
import {mapProps} from "recompose";
import {loader} from 'graphql.macro';

const SlotQuery = loader("../../graphql/queries/slotName.graphql");

const SlotBreadcrumb = ({ slot }) => slot ? <span>{slot.name}</span> : null;

export default compose(
  graphql(SlotQuery, {
    name: 'slotQuery',
    options: (props) =>{
        return {
            variables: {
                id: _.get(props,'match.params.slotId'),
            }
        }
    },
  }),
  mapProps((props) => ({
    slot: _.get(props,'slotQuery.slot'),
  }))
)(SlotBreadcrumb);
