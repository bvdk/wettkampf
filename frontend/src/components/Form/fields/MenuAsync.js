// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import type {DataLoaderType} from "../../DataLoader/DataLoaderType";
import {Query} from "react-apollo";
import {Checkbox, Menu, Spin} from "antd";

type Props = {
  loaderConfig: DataLoaderType,
};

type State = {

}

class MenuAsync extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { loaderConfig } = this.props;

    return <Query query={loaderConfig.query} variables={loaderConfig.getQueryVariables ? loaderConfig.getQueryVariables() : null}>
      {({data, loading})=> {
        if (loading){
          return <Spin />
        }
        return <Menu>
          {_.get(data,`${loaderConfig.dataKey}.${loaderConfig.itemsKey}`).map((item, index) => (<Menu.Item key={_.get(item,loaderConfig.valueKey)}><Checkbox  className={"p-0 m-0"} value={_.get(item,loaderConfig.valueKey)}>{_.get(item,loaderConfig.textKey)}</Checkbox></Menu.Item>))}
        </Menu>
      }

      }
    </Query>;
  }
}

export default MenuAsync;
