// @flow
import React, { Component } from 'react';
import {TreeSelect} from "antd";
import _ from 'lodash'
import type {DataLoaderType} from "../../DataLoader/DataLoaderType";
import {Query} from "react-apollo";
import Loader from "../../Loader";

type Props = {
  loaderConfig?: DataLoaderType,
  searchPlaceholder?: string,
  treeData?: any,
  value: any,
  onChange?: Function,
};

type State = {

}

class TreeSelectAsync extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { loaderConfig, value, treeData } = this.props;

    if (loaderConfig){
      return <Query
        query={loaderConfig.query}
        variables={loaderConfig.getQueryVariables ? loaderConfig.getQueryVariables() : null}

      >
        {({ loading, error, data, startPolling, stopPolling }) => {
          if (loading) {
            return <Loader size={"small"} />;
          }
          if (error) return `Error!: ${error}`;

          const treeData = loaderConfig.dataReducer ? loaderConfig.dataReducer(data) : _.get(data,`${loaderConfig.dataKey}.${loaderConfig.itemsKey}`);
          return this.renderTree(treeData)
        }}
      </Query>
    }

    return <div>
      {this.renderTree(treeData)}
    </div>;
  }

  renderTree = (treeData) =>{

    const { value, searchPlaceholder, onChange } = this.props;

    const tProps = {
      treeData,
      value: value,
      onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: TreeSelect.SHOW_PARENT,
      searchPlaceholder: searchPlaceholder,
      style: {
        width: "100%",
      },
      maxTagCount: 2,
      onChange: onChange,
    };
    const tree = <TreeSelect {...tProps} />;

    return tree;
  }
}


export default TreeSelectAsync;
