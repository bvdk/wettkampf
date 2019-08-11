// @flow
import React, { Component } from "react";
import {Icon, Input, Select, Tooltip} from "antd";
import Colors from "../../../styles/colors";

const Option = Select.Option;


type Props = {
  value?: any,
  onChange?: Function,
  onPressEnter?: Function
};

type State = {
  tmpValue?: string
}

class AttemptResultInput extends Component<Props, State> {

  static defaultProps = {
    attemptResult: {
      weight: null,
      done: false,
      valid: null,
    }
  }

  foucs(){
    if (this.input){
      this.input.focus();
    }
  }

  state = {
    tmpValue: null
  }

  render() {
    let {value } = this.props;

    if (!value){
      value = {};
    }

    let option = 'waiting';
    if (value.done && value.valid=== true){
      option = 'valid'
    }else if (value.done && value.valid === false){
      option = 'invalid'
    }

    const selectAfter = (
      <Select
        style={{width: 40}}
        onChange={(selected)=>{
        const tmp = { ...value };
        switch (selected){
          case 'waiting':
            tmp.done = false;
            tmp.valid = null;
            break;
          case 'valid':
            tmp.done = true;
            tmp.valid = true;
            break;
          case 'invalid':
            tmp.valid = false;
            tmp.done = true;
            break;
          default: {

          }
        }
          if (this.props.onChange){
            this.props.onChange(tmp)
          }
      }}
        value={option}
        defaultValue="waiting"
      >
        <Option value="waiting"><Tooltip placement={'left'} title={'Versuch steht aus'} ><Icon type={"minus"} /></Tooltip></Option>
        <Option value="valid"><Tooltip placement={'left'} title={'Versuch erfolgreich'} ><Icon style={{color: Colors.success}} type={"check"} /></Tooltip></Option>
        <Option value="invalid"><Tooltip placement={'left'} title={'Versuch ungültig'} ><Icon style={{color: Colors.danger}} type={"close"} /></Tooltip></Option>
      </Select>
    );

    return (
      <div className={'attempt-result-input'}>
        <Input
          style={{minWidth: 100}}
          value={this.state.tmpValue || value.weight}
          onChange={(event)=>{

            let inputValue = event.target.value;
            const tmp = {
              ...value,
              weight: inputValue
            };
            if (this.props.onChange){
              this.props.onChange(tmp)
            }
            /*
            let inputValue = event.target.value;
            inputValue = inputValue.replace(',','.');

            const regex = RegExp('[0-9]+.$');
            if (regex.test(inputValue)){
              this.setState({
                tmpValue: inputValue
              })
            }else {
              const tmp = {
                ...value,
                weight: event.target.value ? parseFloat(event.target.value) : null
              };
              if (this.props.onChange){
                this.props.onChange(tmp)
              }
              this.setState({
                tmpValue: null
              })
            }
            */

          }}
          onPressEnter={this.props.onPressEnter}
          addonAfter={selectAfter}
        />
      </div>
    );
  }
}

export default AttemptResultInput;
