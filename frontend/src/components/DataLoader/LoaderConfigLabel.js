// @flow
import React, { Component } from 'react';
import { Query } from "react-apollo";
import _ from "lodash";

type Props = {
  value: any,
  loaderConfig: {
    valueQuery: any,
    getValueQueryVariables: (value: any) => any,
    valueQueryDataKey: string
  }
};

type State = {

}

class LoaderConfigLabel extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { loaderConfig, value} = this.props;

    return <Query query={loaderConfig.valueQuery} variables={loaderConfig.getValueQueryVariables ?loaderConfig.getValueQueryVariables(value) : null}>
      {({ loading, error, data }) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;

        return <span>{_.get(data,loaderConfig.valueQueryDataKey)}</span>
      }}
    </Query>;
  }
}

export default LoaderConfigLabel;
