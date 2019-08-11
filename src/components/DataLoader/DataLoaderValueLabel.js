// @flow
import React, { Component } from 'react';
import {Query} from "react-apollo";
import {translate} from "react-i18next";
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
    const { loaderConfig, value, t } = this.props;

    const query = loaderConfig.valueQuery || loaderConfig.query;
    const variables = loaderConfig.getValueQueryVariables ? loaderConfig.getValueQueryVariables(value) : loaderConfig.getQueryVariables ? loaderConfig.getQueryVariables() : null;

    return <Query
            query={query}
            variables={variables}
        >
        {({ loading, error, data }) => {
            if (loading) {
                return <Loader size={"small"} />;
            }
            if (error) {
                return `Error! ${error.message}`;
            }



            const item = loaderConfig.useListQueryForValue ?
              _.get(data,`${loaderConfig.valueQueryDataKey || loaderConfig.dataKey}.${loaderConfig.textKey}`) :
                loaderConfig.valueQueryDataKey ?
                  _.chain(data).get(loaderConfig.valueQueryDataKey).get(loaderConfig.textKey).value()
                  :
                  _.chain(data).get(loaderConfig.dataKey).get(loaderConfig.itemsKey).find({[loaderConfig.valueKey]: value}).get(loaderConfig.textKey).value();

            console.log(loaderConfig,data);

            if (item){
              return <span>{item}</span>
            }

            return <span>{t(value)}</span>
        }}
        </Query>
  }
}

export default translate('translations')(DataLoaderValueLabel);


