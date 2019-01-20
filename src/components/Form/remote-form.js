// @flow
import React, {Component} from "react"

import {Alert, Button, Form} from "antd";
import FormFactory from "./form-factory";
import FormValueTranslator from "./form-value-translator";
import {debounce} from 'lodash'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ErrorComponent from "../Error";
import {translate} from "react-i18next";

const FormItem = Form.Item;


let saveFormValues = (props, values) => {
  if (props.mutation){
    return props.mutation(props.translateMutationOptions ? props.translateMutationOptions(values) : values)
      .then(res => {
        return res;
      });
  }

  if (props.onSubmit){
    return props.onSubmit(values)
  }

  return new Promise((res)=>{
    res(values);
  });
};

const saveFormValuesDebounced = debounce(saveFormValues, 500);

type Props = {
  mutation: ?Function,
  translateMutationOptions: ?Function,
  onSubmit: ?Function, //Should return a promise
  formConfig: any,
  formLayout: ?any,
  formValues: ?any,
  onFieldsChange: ?Function,
  useSubmit: boolean,
  useRawValues: boolean,
  submitTitle: string,
  onSaved: ?Function,
  fullWidthSubmit: boolean,
  layout: string,
}

class RemoteForm extends Component<Props> {

  formRef = null;

  static defaultProps = {
    layout: 'horizontal',
    submitTitle: "Save",
    formValues: {},
    fullWidthSubmit: false
  }

  constructor(props){
    super(props)

    this.state = {
      submitting: false,
      error: null,
      success: null
    }
  }

  componentDidMount() {
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          submitting: true,
          error: null
        },()=>{
          setTimeout(()=>{
            saveFormValues(this.props, values)
              .then( (res)=>{

                let success = null;
                if (res && res.message){
                  success = res.message;
                }

                this.setState({
                  submitting: false,
                  success
                },()=>{
                  setTimeout(()=>{
                    if (this._ismounted){
                      this.setState({
                        success: null
                      })
                    }
                  },3000)
                })
                if (this.props.onSaved){
                  this.props.onSaved(res);
                }
              }).catch((saveError)=>{
                if (!saveError){
                  saveError = new Error('An Error occured.')
                }
                this.setState({
                  error: saveError,
                  submitting: false
                })
              });
          },300)

        });

      }
    });

  }

  render(){

    const  {layout, t} = this.props;

    let formFactory = new FormFactory(this.props.formConfig, this.props.form);
    formFactory.layout = layout;

    let errorMessage = null;
    if (this.state.error){
      errorMessage = this.state.error.message ? this.state.error.message : this.state.error.toString();
    }

    let submitformItemLayout = null;
    if (layout === 'horizontal'){
      submitformItemLayout = {
        wrapperCol:{ span: 12, offset: 7 }
      }
    }

    return <div style={{position: 'relative'}}>
      <Form layout={layout} onSubmit={this.handleSubmit.bind(this)} ref={(formRef) => { this.formRef = formRef; }}>
        {formFactory.renderFields()}
        {this.props.useSubmit ?
          <FormItem {...submitformItemLayout}>
            <Button type="primary" htmlType="submit" loading={this.state.submitting}>
              {t(this.props.submitTitle)}
            </Button>
          </FormItem>
          : null}

        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          { this.state.success ? <Alert style={{position: 'absolute', top: -70, zIndex: 2, width: '100%'}} message={this.state.success} type="success" showIcon /> : null}
          { errorMessage ? <ErrorComponent title={errorMessage} description={null} closeable={false} /> : null}
        </ReactCSSTransitionGroup>
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
    saveFormValuesDebounced(props, completeValues)
  },
  mapPropsToFields(props) {

    if (props.useRawValues){
      return props.formValues || {};
    }
    const result =  FormValueTranslator.translate(props.formConfig, props.formValues || {});
    return result;
  },
  onValuesChange(props, values) {
    if (props.onValuesChange){
      props.onValuesChange(values);
    }
  },
})(translate('translations')(RemoteForm));
