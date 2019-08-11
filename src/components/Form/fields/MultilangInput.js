// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import type {Attribute} from "../../../types";
import {Input, Select} from "antd";

const Option = Select.Option;


type Props = {
  attributes: Attribute[],
  value: string[],
  onChange?: Function,
};

type State = {

}

let lang = navigator.language || navigator.userLanguage;
lang = lang.replace("-","_");

class MultilangInput extends Component<Props, State> {

  state = {
    selectedLanguage: null
  }

  componentDidMount(): void {

    const userAttribute = this.props.attributes.find(item => lang === item.index);
    if (userAttribute){
      this.state.selectedLanguage = userAttribute.index;
    }else {
      this.state.selectedLanguage = _.first(this.props.attributes).index;
    }

  }

  _handleSelectChange = (selectedLanguage) => {
    this.setState({
      selectedLanguage
    })
  }

  _handleInputChange = (e) => {

    const text = _.get(e,'target.value',null);

    const { value, onChange } = this.props;
    const {selectedLanguage} = this.state;

    const newValue = {
      ...value,
    }
    _.set(newValue,selectedLanguage,text);

    if (onChange){
      onChange(newValue);
    }

  }

  render() {
    const { value } = this.props;

    const selectedSubAttribute = this.props.attributes.find(item => this.state.selectedLanguage === item.index);

    const textValue = selectedSubAttribute ? _.get(value,_.get(selectedSubAttribute,'index')) : null;

    return <Input onChange={this._handleInputChange} type={"text"} value={textValue} addonAfter={<Select onChange={this._handleSelectChange} value={this.state.selectedLanguage}  >
      {this.props.attributes.map(item => <Option key={item.index} value={item.index}>{item.name}</Option>)}
    </Select>}/>;
  }
}

export default MultilangInput;
