// @flow
import React, { Component } from 'react';
import {Query} from "react-apollo";
import _ from 'lodash'
import type {DataLoaderType} from "./DataLoaderType";
import Loader from "../Loader";

type Props = {
    loaderConfig: DataLoaderType,
    value: any
};

type State = {

}

class DataLoaderValueLabel extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { loaderConfig, value } = this.props;

    return <Query
            query={loaderConfig.valueQuery}
            variables={loaderConfig.getValueQueryVariables(value)}
        >
        {({ loading, error, data }) => {
            if (loading) {
                return <Loader size={"small"} />;
            }
            if (error) {
                return `Error! ${error.message}`;
            }
            return <span>{_.get(data,`${loaderConfig.valueQueryDataKey}.${loaderConfig.textKey}`)}</span>
        }}
        </Query>
  }
}

export default DataLoaderValueLabel;


