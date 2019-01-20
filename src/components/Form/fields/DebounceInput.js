// @flow
import React, { Component } from 'react';
import {Input} from "antd";
import _ from 'lodash'

type Props = {
  value: any,
  onChange: Function,
  onKeyPress: Function,
};

type State = {
 tmpValue: any,
}

class DebounceInput extends Component<Props, State> {

  state = {
    tmpValue: undefined
  }

  constructor(props) {
    super(props);
    this.input = React.createRef();
  }


  componentDidMount() {

    this.debounceChange = _.debounce((text)=>{
      this.props.onChange(text);
    },500)
  }

  onChange = (text) => {
    if (this.props.onChange){
      this.props.onChange(text);
    }
  }

  resetValue = () => {

    if (!this.state.focused) {
      setTimeout(()=>{
        this.setState({
          tmpValue: undefined
        })
      },0);
    }else {
      //setTimeout(()=>this.resetValue(),1000);
    }
  }

  onBlur = () => {
    this.setState({ focused: false },()=>{
      setTimeout(()=>this.resetValue(),1000);
    })
  }

  onFocus = () => {
    this.setState({ focused: true })
  }

  focusInput = () => {
    this.input.current.focus();
  }

  _handleChange = (e) => {

    const text = _.get(e,'currentTarget.value');
    this.setState({
      tmpValue: text,
    },()=>{
      this.debounceChange(text);
    });

  }

  _handleKeyPress = (e) => {


    if (e.key === 'Enter' && this.state.tmpValue && this.state.tmpValue.length) {
      this.onChange(this.state.tmpValue);
    }

    if (this.props.onKeyPress){
      this.props.onKeyPress(e);
    }
  }

  render() {
    const { value, placeholder, addonAfter } = this.props;

    const {tmpValue} = this.state;

    return <Input
      ref={this.input}
      onFocus={this.onFocus}
      onBlur={this.onBlur}
      onKeyPress={this._handleKeyPress}
      placeholder={placeholder}
      addonAfter={addonAfter}
      onChange={this._handleChange}
      value={tmpValue === undefined ? value : tmpValue}
    />
  }
}

export default DebounceInput;
