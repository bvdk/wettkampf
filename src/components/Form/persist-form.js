// @flow
import React, {Component} from "react"

import {Button, Form} from "antd";
import FormFactory from "./form-factory";
import {saveForm} from "../../actions/settings";
import FormValueTranslator from "./form-value-translator";
import { debounce } from 'lodash'
const FormItem = Form.Item;


let saveFormValues = (dispatch, formName, values) => {
  dispatch(saveForm(formName, values))
};

saveFormValues = debounce(saveFormValues, 300);

type Props = {
  dispatch: Function,
  formConfig: any,
  formValues: any,
  formName: string,
  onFieldsChange: ?Function,
  useSubmit: boolean,
  submitTitle: string
}

class PersistForm extends Component<Props> {


  static defaultProps = {
    submitTitle: "Speichern"
  }

  constructor(props){
    super(props)

  }

  componentDidMount(){

  }

  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        saveFormValues(this.props.dispatch, this.props.formName, values);
      }
    });

  }

  render(){
    let formFactory = new FormFactory(this.props.formConfig, this.props.form);
    return <div>
      <Form onSubmit={this.handleSubmit.bind(this)}>
        {formFactory.renderFields()}
        {this.props.useSubmit ?
          <FormItem {...formFactory.getTailFormItemLayout()}>
            <Button type="primary" htmlType="submit">
              {this.props.submitTitle}
            </Button>
          </FormItem>
          : null}
      </Form>
    </div>;
  }

}



export default Form.create({
  onFieldsChange(props, changedFields) {
    if (props.useSubmit) return;
    let reducedChanges = Object.keys(changedFields).reduce((res, cur)=>{
      res[cur] = changedFields[cur].value;
      return res;
    },{});
    const completeValues = {
      ...props.formValues,
      ...reducedChanges
    };
    saveFormValues(props.dispatch, props.formName, completeValues)
  },
  mapPropsToFields(props) {
    const values = FormValueTranslator.translate(props.formConfig, props.formValues);
    return values;
  },
  onValuesChange(props, values) {
    if (props.onValuesChange){
      props.onValuesChange(values);
    }
  },
})(PersistForm);

