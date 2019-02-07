// @flow
import React from "react";
import { Checkbox, DatePicker, Dropdown, Form, Icon, Input, Menu, Select, Slider, Switch} from 'antd';
import * as _ from "lodash";
import Autocomplete from "./fields/Autocomplete";
import SelectAsync from "./fields/SelectAsync";
import File from "./fields/File";

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

class FormFactory {

  formConfig;
  form;
  layout = 'horizontal';

  static types = [
    'file',
    'text',
    'float',
    'int',
    'textarea',
    'textArea',
    'text',
    'switch',
    'slider',
    'display',
    'date',
    'datetime',
    'datetimerange',
    'checkbox',
    'multiSelect',
    'multiselect',
    'select',
    'autocomplete',
    'dropdownCheckbox',
    'dropdowncheckbox',
    'component'
  ];

  static formItemBlackList = [
    'display',
    'section',
    'separator',
  ]

  constructor(formConfig, form){
    this.formConfig = formConfig;
    this.form = form;
  }

  renderFields(){

    if (this.formConfig.groups){
      return this.formConfig.groups.map(group => this.renderGroup(group));
    }

    let fields = (Object.keys(this.formConfig.fields).map((key)=>this.renderField(key, this.formConfig.fields[key]))).filter(item => item);

    return fields
  }

  renderGroup(group){

    let fields = Object.keys(this.formConfig.fields)
      .filter(key => this.formConfig.fields[key].categories && this.formConfig.fields[key].categories.indexOf(group.key)> -1)
      .map(key => ({
        ...this.formConfig.fields[key],
        name: key
      }));
    return <div key={group.key}>
      <div className="pv-10">
        <label className="bold large-text">{group.title}</label>
        <hr/>
      </div>
      <div>{fields.map(field => this.renderField(field.name, field))}</div>
    </div>

  }

  getHorizontalFormItemLayout(){
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
    };
  }

  getTailFormItemLayout(){
    return {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
  }


  renderField(name, field, disableFormItem = false){

    let shouldRenderFormItem = !disableFormItem && FormFactory.formItemBlackList.indexOf(field.type) === -1;

    const getFieldDecorator = this.form.getFieldDecorator;
    let options = {
      label: field.title,
      id: name,
      key: name,
      placeholder: field.placeholder,
      value: this.values ? this.values[name] : null,
    };

    if (!field.rules){
      const rule = this.ruleForAttribute(field);
      if (rule){
        field.rules = [
          rule
        ]
      }
    }

    let formItemLayout = null;
    if (field.formItemLayout){
      formItemLayout = field.formItemLayout;
    }else {
      if (this.layout === 'horizontal'){
        formItemLayout = this.getHorizontalFormItemLayout();
      }
    }

    let result = null;
    let hidden = false;

    if (field.condition) {
      hidden = !field.condition(this.form);
    }


    switch(field.type.toLowerCase()){
      case 'float':
      case 'int': {
        result = getFieldDecorator(options.id, {
          rules: field.rules,
          normalize: (value)=>{
            let result = value;
            if (field.type.toLowerCase() === 'float' && /^[0-9]+(\.[0-9]+)?$/g.test(value)){
              result = Number.parseFloat(value);
            } else if (field.type.toLowerCase() === 'float' && /[+]?\d*(?:\.\d*)?(?:[eE][+]?\d+)$/g.test(value)){
              result = Number.parseFloat(value);
            } else if (field.type.toLowerCase() === 'int' && /^\d+$/g.test(value)){
              result = Number.parseInt(value, 10);
            }
            if (_.isNaN(result)){
              return value === '' ? undefined : value;
            }

            return !result && result !== 0 ? undefined : result;
          }
        })(
          <Input
            placeholder={options.placeholder}
            {...field.inputTypeOptions}
            addonAfter={field.config && field.config.addonAfter && _.isObject(field.config.addonAfter) && field.config.addonAfter.index ? this.renderField(field.config.addonAfter.index, {
              ...field.config.addonAfter,
              inputTypeOptions: {
                ...field.inputTypeOptions,
              }
            }, true) : field.config ? field.config.addonAfter : null }
          />
        )
        break;
      }
      case 'textArea':
      case 'textarea':
      case 'text': {

        result = getFieldDecorator(options.id, {
          rules: field.rules,
        })(
          <Input
            placeholder={field.placeholder}
            {...field.inputTypeOptions}
            addonAfter={field.config && field.config.addonAfter && _.isObject(field.config.addonAfter) && field.config.addonAfter.index ? this.renderField(field.config.addonAfter.index, {
              ...field.config.addonAfter,
              inputTypeOptions: {
                ...field.inputTypeOptions,
              }
            }, true) : field.config ? field.config.addonAfter : null }
          />
        )
        break;

      }

      case 'password': {

        result = getFieldDecorator(options.id, {
          rules: field.rules,
        })(
          <Input type="password" placeholder={field.placeholder}
                 {...field.inputTypeOptions}/>
        )
        break;

      }
      case 'switch': {
        result = getFieldDecorator(options.id , { valuePropName: 'checked' })(
          <Switch />
        );
        break;
      }

      case 'slider': {
        result = getFieldDecorator(options.id )(
          <Slider {...field.inputTypeOptions}/>
        );
        break;
      }

      case 'display': {
        result = <span className="ant-form-text">{options.value}</span>
        break;
      }

      case 'section': {

        result = <div className="pv-10" key={options.key}>
          {field.title ? <label className="bold large-text">{field.title}</label> : null}
          <hr/>
        </div>;
        break;
      }

      case 'separator': {
        result = <div key={options.key}><hr/></div>;
        break;
      }

      case 'datetime': {
        result = getFieldDecorator(options.id)(
          <DatePicker
            style={{display: hidden ? 'none' : 'block'}}
            showTime
            format="DD.MM.YYYY HH:mm:ss"
            {...formItemLayout}
            {...options}
          />
        );

        break;
      }

      case 'datetimerange': {
        const rangeConfig = {
          rules: field.rules,
        };
        result = getFieldDecorator(options.id , rangeConfig)(
          <RangePicker showTime format="DD.MM.YYYY HH:mm" />
        )

        break;
      }

      case 'daterange': {
        const rangeConfig = {
          rules: field.rules,
        };
        result = getFieldDecorator(options.id , rangeConfig)(
          <RangePicker format="DD.MM.YYYY" />
        )

        break;
      }

      case 'dropdowncheckbox': {
        result = getFieldDecorator(options.id , {
          rules: field.rules,
        })(
          <CheckboxGroup>
            <Menu>
              {field.options.map((item, index) => (<Menu.Item className={"pv-0 ph-5 m-0"} key={index}>
                <Checkbox className={"p-0 m-0"} value={item.value}>{item.title}</Checkbox>
              </Menu.Item>))}
            </Menu>
          </CheckboxGroup>
        )
        result = <Dropdown overlay={result}><span className="ant-dropdown-link">
          {field.title} <Icon type="down" />
        </span></Dropdown>
        break;
      }

      case 'checkbox': {
        result = getFieldDecorator(options.id , {
          rules: field.rules,
        })(
          <CheckboxGroup options={field.options.map(item => ({
            label: item.title,
            value: item.value
          }))}/>
        )
        break;
      }

      case 'multiselect':
      case 'select': {
        result = getFieldDecorator(options.id, {
          rules: field.rules,
        })(
          field.config && field.config.loaderConfig ? (
            <SelectAsync
              mode={
                field.type.toLowerCase() === 'multiselect'
                  ? 'multiple'
                  : field.config ? field.config.mode : undefined
              }
              {...field.config}
              options={field.options}
              placeholder={options.placeholder}
            />
          ) : (
            <Select
              {...field.config}
              mode={
                field.type.toLowerCase() === 'multiselect'
                  ? 'multiple'
                  : field.config ? field.config.mode : undefined
              }
              placeholder={options.placeholder}
            >
              {field.options ? field.options.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.title}
                </Option>
              )) : null}
            </Select>
          ),
        )

        break;
      }



      case 'autocomplete': {

        result = getFieldDecorator(options.id , {
          rules: field.rules
        })(
          <Autocomplete {...field.config} placeholder={options.placeholder} />
        )
        break;

      }

      case 'file': {

        result = getFieldDecorator(options.id , {
          rules: field.rules
        })(
          <File {...field.config}
                imageOnly={field.rules.reduce((acc, cur)=>{

                  if (!acc){
                    return cur.index === 'image'
                  }
                  return acc;
                },false)}
                multiple={false}
                placeholder={options.placeholder} />
        )
        break;

      }

        default: {}

    }

    if (shouldRenderFormItem){
      result = <FormItem
        style={{display: this.layout === 'inline' ? 'inline-block' : null}}
        {...formItemLayout}
        {...options}
      >
        {result}
      </FormItem>
    }

    return result;
  }

  ruleForAttribute(field) {
    switch (field.type.toLowerCase()){

      case 'float': {
        return {
          type: 'number',
          // validator: (rule, value, cb)=>{
          //   if (/^[0-9](\.[0-9]+)?$/g.test(value) || /[+\-]?\d*(?:\.\d*)?(?:[eE][+\-]?\d+)$/g.test(value)){
          //     cb();
          //   }else {
          //     cb('Kein gültiger Dezimalwert');
          //   }
          //
          // }
        }
      }

      case 'int': {
        return {
          type: 'number',

        }
      }

      case 'textArea':
      case 'textarea':
      case 'text': {
        return {
          type: 'string'
        }
      }

      default:

    }
    return null;
  }
}

export default FormFactory;
