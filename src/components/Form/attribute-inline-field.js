// @flow
import React, { Component } from 'react';
import _ from 'lodash'
import {Form, Icon} from "antd";
import posed from "react-pose";
import AttributeFormFactory from "./attribute-form-factory";
import Loader from "../Loader";
import Colors from "../../styles/colors";
import type {Attribute} from "../../types";
import "./attribute-inline-field.css";

const FormItem = Form.Item;


type Props = {
    attribute: Attribute,
    form: any,
    readOnly: boolean,
    value?: any,
    formItemLayout?: any,
    onSubmit: () => void,
    loading: boolean,
    dirty: boolean,
    showSuccess: ?boolean,
    showError: ?boolean,
};

type State = {
    editable: boolean,
}

const SuccessPose = posed.span({
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
})

class AttributeInlineField extends Component<Props, State> {

    static defaultProps = {
        formItemLayout: undefined,
        loading: true,
        dirty: false,
    }

    state = {
        editable: false,
    }

    check = () => {
        this.setState({ editable: false },()=>{
            if (this.props.onSubmit) {
                this.props.onSubmit();
            }
        })
    }

    edit = () => {
        this.setState({ editable: true });
    }

    close = () => {
        this.setState({ editable: false });
    }

    handleKeyPress =  (e) => {

        if (e.key === 'Enter') {
            e.preventDefault();
            this.check();
        }

        if (e.key === 'Escape'){
            this.close();
        }
    }




    render() {
        const { attribute, form, formItemLayout, t, loading, readOnly} = this.props;
        const { editable} = this.state;

        let name =_.get(attribute,'name');
        if (_.isObject(name)){
          name = `${name}`;
        }

        return (
            <FormItem
                className={'AttributeInlineField'}
                label={name}
                {...formItemLayout}
            >
                {
                    !readOnly && editable ? (
                        <div className={'AttributeInlineField-input-wrapper'} >
                            <div className={'AttributeInlineField-input-content'}>
                                {React.cloneElement(AttributeFormFactory.renderAttribute(attribute, form, t),{
                                    onKeyPress: this.handleKeyPress
                                })}
                            </div>
                            {
                                loading ? <Loader useIcon /> : null
                            }
                            <Icon
                                type="check"
                                className="editable-icon-check"
                                onClick={this.check}
                            />
                        </div>
                    ) : (
                        <div onClick={this.edit} className={'AttributeInlineField-display-wrapper'} >
                            <div className={'AttributeInlineField-display-content'}>
                                {AttributeFormFactory.renderDisplayAttribute(attribute, form, t)}
                            </div>

                            {
                                loading ? <Loader useIcon /> : null
                            }
                            {
                              !readOnly ? <Icon
                                  type="edit"
                                  className="editable-icon-pencil"
                                  onClick={this.edit}
                              /> : null
                            }
                            <div className={'AttributeInlineField-feedback'}>
                                <SuccessPose
                                    pose={this.props.showSuccess === true ? 'visible' : 'hidden'}
                                ><Icon style={{margin: '0 8px', color: Colors.success}} type="check"/></SuccessPose>
                                <SuccessPose
                                    pose={this.props.showError === true ? 'visible' : 'hidden'}
                                ><Icon style={{margin: '0 8px', color: Colors.error}} type="exclamation-circle"/></SuccessPose>
                            </div>

                        </div>
                    )
                }
            </FormItem>

        );
    }
}

export default AttributeInlineField;
