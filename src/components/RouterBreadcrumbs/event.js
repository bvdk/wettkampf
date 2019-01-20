
import React from 'react';
import _ from "lodash";
import { loader } from 'graphql.macro';
import {compose, graphql} from "react-apollo";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import {mapProps} from "recompose";
const EventQuery = loader("../../graphql/queries/eventName.graphql");

const EventBreadcrumb = ({ name }) => <span>{name}</span>;

export default compose(
  graphql(EventQuery, {
    name: 'eventQuery',
    options: (props: Props) =>({
      variables: {
        id: props.id
      }
    }),
  }),
  waitWhileLoading('eventQuery'),
  mapProps((props) => ({
    name: _.get(props,'eventQuery.event.name'),
  }))
)(EventBreadcrumb);
