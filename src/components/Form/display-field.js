// @flow
import React, {Component} from "react"

type Props = {
  attribute: {
     title: string,
     name: string,
     type: string,
   },
  value: ?any,
  labelCol: number,
  onDetailButton: ?Function,
  layout: string,
}

class DisplayField extends Component<Props> {

  static defaultProps = {
    layout: 'horizontal',
    labelCol: 6,
    detailIcon: 'info'
  };


  render(){

    let value = this.props.value;

    const optionTypes = [
      'bool',
      'boolean'
    ];

    if ( this.props.attribute.options && optionTypes.indexOf(this.props.attribute.type.toLowerCase())>-1 && this.props.attribute.options[value] !== null){
      value = this.props.attribute.options[value];
    }

    return <div className={`ant-row ant-form-item ant-form-${this.props.layout} ${this.props.layout === 'horizontal' ? 'mb-0' : 'mb-5'}`}>

      <div className={`ant-form-item-label ant-col-xs-24 ant-col-sm-${this.props.labelCol}`}>
        <label title={this.props.attribute.name}>{this.props.attribute.title}</label>
      </div>
      <div className={`ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-${this.props.labelCol < 24 ? 24-this.props.labelCol : 24}`}>

        {/*{this.props.onDetailButton !== null ? <div className="pull-right mr-10">*/}
          {/*<Button*/}
            {/*size="small"*/}
            {/*icon={this.props.detailIcon}*/}
            {/*shape="circle"*/}
            {/*onClick={(e)=>{this.props.onDetailButton(this.props.attribute, this.props.value, e)}}/>*/}
        {/*</div> : null}*/}

        <div className="ant-form-item-control pull-left">
          <span className="ant-form-text">{value !== null ? value : '-' }</span>
        </div>
      </div>

    </div>;
  }

}

export default DisplayField;
