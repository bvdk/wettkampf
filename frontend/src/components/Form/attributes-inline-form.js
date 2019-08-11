// @flow
import React, {Component} from 'react';
import {Button, Col, Form, message, Row, Tabs} from "antd";
import _ from "lodash";
import update from 'immutability-helper';
import styled from 'styled-components';
import type {Attribute, AttributeValue, FormItemLayout} from "./../../types";
import FormValueTranslator from "./form-value-translator";
import formValueToAttributeValue from "./fomValues-to-attributeValues";
import AttributeFormFactory from "./attribute-form-factory";
import Error from "../Error";
import Sizes from "../../styles/sizes";
import AttributeInlineEditField from "./attribute-inlineedit-field-connected";
import {withNamespaces} from "react-i18next";

const TabPane = Tabs.TabPane;

export type FormGroup = {
    name: string | Node,
    categoryIndex: string,
    formItemLayout?: FormItemLayout,
    footer: string | Node,
    colProps: any
}

type Props = {
    t: Function,
    resetFields: ?boolean,
    readOnly: ?boolean,
    form: any,
    layout: 'horizontal' | 'vertical' | 'inline',
    attributes: Attribute[],
    onChange?: (values: AttributeValue, attribute: Attribute) => void,
    mutation?: Function,
    translateMutationOptions?: (attributeValue: AttributeValue, rawValue: any)=> any,
    customFormItemLayouts: {
        [key: string]: FormItemLayout
    },
    values?: any,
    inline: boolean,
    submitTitle?: string,
    groups?: FormGroup[],
    onValuesChange?: Function,
    useSubmit: Boolean,
    useTabs?: Boolean,
    onSubmit: ?Function,
    submitButtonWrapperStyle: ?any,
    collapse: string[],
};

type State = {
    error?: Error,
    loadingAttributes: string[],
    successAttributes: string[],
    errorAttributes: string[],
    activeTab?: string
}

const FormItem = Form.Item;

const GroupTitle = styled.div`
  font-size: 18px;
  padding: 8px 16px;
  border-bottom: 1px solid #ccc;
  margin: 16px 0 12px;
`;

const Footer = styled.div`
  padding: 16px 8px;
`;

const InnerPadding = styled.div`
  padding: 0 16px;
`;

// const transformField = (obj, arr = [], parent = '') => {
//     if (!obj) return [];
//     if (parent) parent = `${parent}.`;
//     Object.keys(obj).forEach(key => {
//         const fullKey = `${parent}${key}`;
//         if (obj[key] && typeof obj[key] === 'object') {
//             transformField(obj[key], arr, fullKey);
//         } else {
//             arr.push(fullKey);
//         }
//     });
//     return arr;
// };

class AttributesInlineForm extends Component<Props, State> {
    static defaultProps = {
        layout: 'horizontal',
        values: {},
        customFormItemLayouts: {},
        inline: false,
        useSubmit: true,
        readOnly: false,
    };

    state = {
        collapsed: true,
        error: undefined,
        values: this.props.values,
        submitting: false,
        loadingAttributes: [],
        successAttributes: [],
        errorAttributes: [],
        activeTab: undefined,
    };

    formItemLayout = this.props.layout === 'horizontal' ? {
        labelCol: {
            md: {span: 24},
            lg: {span: 7},
        },
        wrapperCol: {
            md: {span: 24},
            lg: {span: 17},
        },
    } : null;

    offsetFormItemLayout = this.props.layout === 'horizontal' ? {
        wrapperCol: {
            md: {span: 24},
            lg: {span: 17, offset: 7},
        },
    } : null;


    handleSubmit = (e, fieldKeys) => new Promise((resolve, reject) => {
        if (e) {
            e.preventDefault();
        }
        const {form, mutation, translateMutationOptions, attributes, t} = this.props;

        form.validateFields((err) => {
            if (!err) {
                // Get an array of changed fields
                const arr = Object.keys(form.getFieldsValue()).filter(x => form.isFieldTouched(x));
                const values = form.getFieldsValue(fieldKeys || arr);
                const attributeValues = formValueToAttributeValue(attributes, values, false);
                const done = (res) => {
                    if (this.props.onSubmit) {
                        this.props.onSubmit(res, attributeValues);
                    }
                    this.setState({
                        submitting: false
                    });
                    resolve();
                };

                if (mutation) {
                    this.setState({
                        submitting: true,
                    }, () => {
                        let promise = null;
                        if (translateMutationOptions) {
                            promise = mutation(translateMutationOptions(attributeValues, values));
                        } else {
                            promise = mutation({
                                variables: {
                                    attributes: attributeValues
                                }
                            })
                        }
                        if (promise) {
                            promise
                                .then((res) => {
                                    message.success(t('Gespeichert'))

                                    if (this.props.resetFields) {
                                        form.resetFields();
                                    }

                                    return res;
                                })
                                .catch((res) => {
                                    message.error(res.message || 'An error occurred while submitting the form data')
                                })
                                .then(done)
                        } else {
                            done();
                        }
                    })
                } else {
                    done();
                }
            } else {
                reject();
            }
        });
    });

    _toggleCollapse = () => this.setState({
        collapsed: !this.state.collapsed,
    });

    handleSubmitAttribute = (attribute) => {
        this.setState(update(this.state, {
            loadingAttributes: {$push: [attribute.index]}
        }), () => {
            this.handleSubmit(null, [attribute.index])
                .then(() => {
                    this.showSuccess(attribute.index)
                })
                .catch(() => {
                    this.showError(attribute.index)
                })
                .finally(() => {
                    this.setState(update(this.state, {
                        loadingAttributes: {$splice: [[this.state.loadingAttributes.indexOf(attribute.index), 1]]}
                    }))
                })
        })
    };

    showSuccess(index: string) {
        this.setState(update(this.state, {
            successAttributes: {$push: [index]}
        }), () => {
            setTimeout(() => {
                this.setState(update(this.state, {
                    successAttributes: {$splice: [[this.state.successAttributes.indexOf(index), 1]]}
                }))
            }, 1000)
        })
    }

    showError(index: string) {
        this.setState(update(this.state, {
            errorAttributes: {$push: [index]}
        }), () => {
            setTimeout(() => {
                this.setState(update(this.state, {
                    errorAttributes: {$splice: [[this.state.errorAttributes.indexOf(index), 1]]}
                }))
            }, 1000)
        })
    }

    renderAttribute = (attribute, index) => {
        const {t, form, inline, customFormItemLayouts, readOnly, mutation, translateMutationOptions} = this.props;
        const formItemLayout = _.get(
            attribute, 'config.formItemLayout',
            customFormItemLayouts && customFormItemLayouts[attribute.index] ?
                customFormItemLayouts[attribute.index]
                : this.formItemLayout
        );

        if (inline) {
            return <AttributeInlineEditField
                key={`${index}`}
                value={this.props.values[attribute.index]}
                form={form}
                readOnly={readOnly}
                formItemLayout={formItemLayout}
                attribute={attribute}
                onSubmit={this.props.onSubmit}
                mutation={mutation}
                translateMutationOptions={translateMutationOptions}
            />
        }

        return <FormItem
            key={index}
            className="AttributeField"
            label={attribute.name ? `${attribute.name}` : undefined}
            {...formItemLayout}
        >
            {AttributeFormFactory.renderAttribute(attribute, form, t)}
        </FormItem>

    }

    filterCategoryAttributes = (attributes, group) => attributes
        .filter(item => _.get(item, 'categories', [])
            .map(cat => _.isString(cat) ? cat : _.get(cat, 'index', 'default'))
            .indexOf(group.categoryIndex) !== -1
        )
        .map(item => ({
            ...item,
            config: {
                formItemLayout: group.formItemLayout,
                ...item.config,
            }
        }));

    renderGroups = (attributes) => {
        const {useTabs, groups} = this.props;

        if (groups && groups.length) {
            if (useTabs) {
                return <Tabs activeKey={this.state.activeTab || _.get(_.first(groups), 'categoryIndex')}
                             onChange={(activeTab) => this.setState({activeTab})}>
                    {groups.map(group => (<TabPane tab={group.name} key={group.categoryIndex}>
                        {this.filterCategoryAttributes(attributes, group)
                            .map(this.renderAttribute)}
                    </TabPane>))}
                </Tabs>
            } else {
                return <InnerPadding>
                    <Row gutter={16}>
                        {groups.map((group: FormGroup, index) => {
                            return <Col className={`form-group-${group.categoryIndex}`}
                                        key={`${index}`} {...group.colProps} >
                                {group.name ? <GroupTitle
                                    className={'AttributesInlineForm-group-title'}>{group.name}</GroupTitle> : null}
                                <div className={'AttributesInlineForm-group-fields'}>{
                                    this.filterCategoryAttributes(attributes, group)
                                        .map(this.renderAttribute)
                                }</div>
                                {group.footer ? <Footer>{group.footer}</Footer> : null}
                            </Col>
                        })}
                    </Row>
                </InnerPadding>
            }
        }

        const fields = attributes.map(this.renderAttribute);
        if (this.props.layout === 'inline') {
            return <span>
                {fields}
            </span>
        }

        return <div>
            {fields}
        </div>
    };

    render() {
        let {attributes} = this.props;
        const {layout, t, inline, useSubmit, form} = this.props;

        if (!attributes || !attributes.length) {
            return <Error t="No Attributes defined"/>
        }

        const {submitting} = this.state;

        if (this.props.collapse && this.state.collapsed) {
            attributes = attributes.filter(item => this.props.collapse.indexOf(item.index) !== -1);
        }

        attributes = attributes.filter(attribute => {
            let hidden = false;
            if (attribute.condition) {
                hidden = !attribute.condition(form);
            }

            return !hidden;
        });


        return <div className={this.props.className}
                    style={{position: 'relative', display: layout === 'inline' ? 'inline' : undefined}}>
            <Form layout={layout} onSubmit={this.handleSubmit}>
                {this.renderGroups(attributes)}
                {!inline && useSubmit ?
                    <FormItem
                        style={{marginTop: 16, ...this.props.submitButtonWrapperStyle}} {...this.offsetFormItemLayout}
                    >
                        {this.props.collapse ?
                            <button className="link-button"
                                    onClick={this._toggleCollapse}>
                                {t(this.state.collapsed ? 'Display more' : 'Display less')}
                            </button> : null
                        }
                        <Button
                            className={this.props.collapse ? "pull-right" : null}
                            type="primary"
                            htmlType="submit"
                            loading={submitting}
                        >
                            {this.props.submitTitle ? this.props.submitTitle : 'Speichern'}
                        </Button>
                    </FormItem> :
                        this.props.collapse ?
                            <button
                                className="link-button"
                                style={{display: 'inline-block', padding: Sizes.grid}}
                                onClick={this._toggleCollapse}>
                                {t(this.state.collapsed ? 'Display more' : 'Display less')}
                            </button> : null
                }

            </Form>
        </div>;
    }
}

export default Form.create({
    onFieldsChange(props, changedFields) {
        if (props.onChange) {
            let reducedChanges = Object.keys(changedFields).reduce((res, cur) => {
                res[cur] = changedFields[cur].value;
                return res;
            }, {});
            const completeValues = {
                ...props.values,
                ...reducedChanges
            };
            props.onChange(formValueToAttributeValue(props.attributes, completeValues, false));
        }
    },
    mapPropsToFields(props) {
        return FormValueTranslator.translateAttributes(props.attributes, props.values);
    },
    onValuesChange(props, values) {
        if (props.onValuesChange) {
            const attributeValues = formValueToAttributeValue(props.attributes, values, false);
            props.onValuesChange(attributeValues);
        }
    },
})(withNamespaces()(AttributesInlineForm));

