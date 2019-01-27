// @flow
import React, { Component } from 'react';
import _ from 'lodash'
import {Button, Form, Icon} from "antd";
import posed from "react-pose";
import AttributeFormFactory from "./attribute-form-factory";
import Loader from "../Loader";
import Colors from "../../styles/colors";
import "./attribute-inline-field.css";
import formValueToAttributeValue from "./fomValues-to-attributeValues";

const FormItem = Form.Item;


type Props = {
    form: any,
    attribute: Attribute,
    readOnly: boolean,
    value?: any,
    formItemLayout?: any,
    mutation: () => Promise,
    translateMutationOptions: ({[string]: any}) => any,
    onChange: Function,
};

type State = {
    editable: boolean,
}

const SuccessPose = posed.span({
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
})

class AttributeInlineEditField extends Component<Props, State> {

    constructor(props) {
        super(props);
        this.input = React.createRef();
    }

    static defaultProps = {
        formItemLayout: undefined,
        readOnly: false,
    }

    state = {
        loading: false,
        editable: false,
        success: false,
        error: false,
    }

    check = () => {
        if (this.props.form.isFieldTouched(this.props.attribute.index)){
            this.submit();
        }
        this.setState({ editable: false });
    }

    edit = () => {
        this.setState({ editable: true },()=>{
            console.log(this.input);
            const focusInput = _.get(this.input,'current.focusInput');
            if (focusInput){
                focusInput();
            }

        });
    }

    close = () => {
        this.setState({ editable: false });
    }

    showSuccess(index: string){
        this.setState({
            success: true,
        },()=>{
            setTimeout(()=>{
                this.setState({
                    success: false
                })
            },1000)
        })
    }

    showError(index: string){
        this.setState({
            error: true,
        },()=>{
            setTimeout(()=>{
                this.setState({
                    error: false
                })
            },1000)
        })
    }


    submit = () => {

        const {mutation, translateMutationOptions, attribute, form} = this.props;

        const value = {};
        _.set(value,attribute.index,form.getFieldValue(attribute.index));
        const attributeValues = formValueToAttributeValue([attribute], value, false);

        if (mutation){
            this.setLoading(true)
              .then(()=>mutation(translateMutationOptions ? translateMutationOptions(attributeValues) : {input: attributeValues}))
              .then(() => this.showSuccess)
              .catch(() => this.showError)
              .finally(() => this.setLoading(false))
        }

    }

    setLoading = (loading) => {
        return new Promise((resolve) => {
            this.setState({
                loading
            }, resolve)
        })
    }

    handleKeyPress =  (e) => {

        console.log('Press',e.key);

        if (e.key === 'Enter') {
            e.preventDefault();
            this.check();
        }

        if (e.key === 'Escape'){
            this.close();
        }
    }


    render() {
        const { attribute, form, formItemLayout, t, readOnly, value} = this.props;
        const { editable, loading, success, error} = this.state;

        let name =_.get(attribute,'name');
        if (_.isObject(name)){
            name = `${name}`;
        }

        return (
          <FormItem
            className={'attribute-inline-edit-field'}
            label={name}
            {...formItemLayout}
          >
              {
                  !readOnly && editable ? (
                    <div className={'editable-cell'} >
                        <div className={'attribute-inline-edit-field-input-content'}>
                            {React.cloneElement(AttributeFormFactory.renderAttribute(attribute, form, t),{
                                onKeyPress: this.handleKeyPress,
                                ref: this.input
                            })}
                        </div>
                        {
                            loading ? <Loader useIcon /> : null
                        }
                        <div
                            className="editable-icon-check" style={{paddingLeft: 5}}>
                            <Button
                                shape={"circle"}
                                size={"small"}
                                onClick={this.check}
                            >
                                <Icon
                                    type="check"
                                />
                            </Button>
                        </div>

                    </div>
                  ) : (
                    <div onClick={this.edit} className={'editable-cell-value-wrap'} >
                        <div className={'editable-cell-value-content'}>
                            {AttributeFormFactory.renderDisplayAttribute(attribute, form, t, value)}
                        </div>

                        {
                            loading ? <Loader useIcon /> : null
                        }

                        {success || error ? <div className={'attribute-inline-edit-field-feedback'}>
                            <SuccessPose
                              pose={success? 'visible' : 'hidden'}
                            ><Icon style={{margin: '0 8px', color: Colors.success}} type="check"/></SuccessPose>
                            <SuccessPose
                              pose={error === true ? 'visible' : 'hidden'}
                            ><Icon style={{margin: '0 8px', color: Colors.error}} type="exclamation-circle"/></SuccessPose>
                        </div> : null}
                        {
                            !readOnly ? <div><Icon
                              type="edit"
                              className="editable-icon-pencil"
                              onClick={this.edit}
                            /></div> : null
                        }
                    </div>
                  )
              }
          </FormItem>

        );
    }
}

export default AttributeInlineEditField;

/*export default onClickOutside(AttributeInlineEditField, {
    handleClickOutside: function(instance) {
        return instance.close;
    }
});*/
