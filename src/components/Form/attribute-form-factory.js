// @flow
import React from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Dropdown,
  Icon,
  Input,
  Menu,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect
} from 'antd';
import _ from "lodash";
import moment from "moment";

import Autocomplete from "./fields/Autocomplete";
import SelectAsync from "./fields/SelectAsync";
import File from "./fields/File";
import AttributeRulesMap from "./rules";
import EnumLoaderConfig from "../DataLoader/EnumLoaderConfig";
import LoaderConfigLabel from "../DataLoader/LoaderConfigLabel";
import attributeTypeValue from "./attributeTypeValue";
import EditTable from "./fields/EditTable";
import DataLoaderValueLabel from "../DataLoader/DataLoaderValueLabel";
import TablePicker from "./fields/TablePicker";
import DebounceInput from "./fields/DebounceInput";
import MenuAsync from "./fields/MenuAsync";
import OneLineLabel from "../OneLineLabel";
import AgeClassesLoaderConfig from "../DataLoader/AgeClassesLoaderConfig";
import WeightClassesLoaderConfig from "../DataLoader/WeightClassesLoaderConfig";
import ResultClassesLoaderConfig from "../DataLoader/ResultClassesLoaderConfig";
import EventSlotsLoaderConfig from "../DataLoader/EventSlotsLoaderConfig";
import EventAthleteGroupsLoaderConfig from "../DataLoader/EventAthleteGroupsLoaderConfig";
import AttemptResultInput from "./fields/AttemptResultInput";
import Colors from "../../styles/colors";
import AttemptDisplayLabel from "../AttemptDisplayLabel";

const CheckboxGroup = Checkbox.Group;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const { TextArea } = Input;


class FormFactory {

  static getConfigForAttribute(attribute: Attribute){

    let config = {
      ...attribute.config
    };

    switch (attribute.entityType){

      case 'enum': {
        config.showSearch = true;
        config.loaderConfig = {
          ...EnumLoaderConfig,
          getQueryVariables: ()=> ({
            name: attribute.enumType
          })
        };
        break;
      }

      case 'AgeClass': {
        config.showSearch = true;
        config.loaderConfig = {
          ...AgeClassesLoaderConfig
        };
        break;
      }

      case 'EventSlot': {
        config.loaderConfig = {
          ...EventSlotsLoaderConfig,
          getQueryVariables: attribute.getQueryVariables,
          local: true,
        };
        break;
      }

      case 'EventAthleteGroup': {
        config.loaderConfig = {
          ...EventAthleteGroupsLoaderConfig,
          getQueryVariables: attribute.getQueryVariables,
          local: true,
        };
        break;
      }

      case 'WeightClass': {
        config.showSearch = true;
        config.loaderConfig = {
          ...WeightClassesLoaderConfig,
          local: true,
        };
        break;
      }

      case 'ResultClass': {
        config.showSearch = true;
        config.loaderConfig = {
          ...ResultClassesLoaderConfig,
          getQueryVariables: attribute.getQueryVariables,
          local: true,
        };
        break;
      }

      case 'WeightClassMale': {
        config.showSearch = true;
        config.loaderConfig = {
          ...WeightClassesLoaderConfig,
          local: true,
          localFilter: (item) => _.get(item,'props.item.gender') === 'MALE'
        };
        break;
      }

      case 'WeightClassFemale': {
        config.showSearch = true;
        config.loaderConfig = {
          ...WeightClassesLoaderConfig,
          local: true,
          localFilter: (item) => _.get(item,'props.item.gender') === 'FEMALE'
        }
        ;
        break;
      }


      default:
        break;
    }

    if (attribute.file) {
      config.file = attribute.file;
    }

    return config;

  }

  static renderAttribute(attribute: Attribute, form: {getFieldDecorator: Function}, t: Function, value){

/*
    if (attribute.readonly){
      return this.renderDisplayAttribute(attribute, form, t, value);
    }
    */

    const getFieldDecorator = form.getFieldDecorator;
    let result = null;
    let rules = [];
    if (attribute.rules) rules = attribute.rules.map(item => _.get(item, 'name')).filter(ruleKey => AttributeRulesMap[ruleKey]).map(ruleKey => AttributeRulesMap[ruleKey]);

    // if (!rules || rules.length === 0){
    //   const attributeTypeRule = this.ruleForAttribute(attribute);
    //   if (attributeTypeRule){
    //     rules = [attributeTypeRule];
    //   }
    // }



    const config = FormFactory.getConfigForAttribute(attribute);
    const placeholder = attribute.inputTypeOptions ? attribute.inputTypeOptions.placeholder : null;
    let addonAfter = attribute.inputTypeOptions ? attribute.inputTypeOptions.addonAfter : null;
    if (_.isObject(addonAfter)){
      addonAfter = this.renderAttribute(addonAfter, form, t);
    }

    switch(attribute.inputType.toLowerCase()){
      case 'float':
      case 'int': {
        rules.push(AttributeRulesMap.number)
        result = getFieldDecorator(attribute.index, {
          rules,
          normalize: (value)=>{
            let result = value;
            if (attribute.type.toLowerCase() === 'float' && /^[0-9]+(\.[0-9]+)?$/g.test(value)){
              result = Number.parseFloat(value);
            } else if (attribute.type.toLowerCase() === 'float' && /[+]?\d*(?:\.\d*)?(?:[eE][+]?\d+)$/g.test(value)){
              result = Number.parseFloat(value);
            } else if (attribute.type.toLowerCase() === 'int' && /^\d+$/g.test(value)){
              result = Number.parseInt(value, 10);
            }
            if (_.isNaN(result)){
              return value === '' ? undefined : value;
            }

            return !result && result !== 0 ? undefined : result;
          }
        })(
          <Input
            placeholder={placeholder}
            addonAfter={addonAfter}
          />
        )
        break;
      }
      case 'textArea':
      case 'textarea':{
        result = getFieldDecorator(attribute.index, {
          rules
        })(
          <TextArea
            disabled={attribute.readonly}
            rows={5}
            placeholder={placeholder}
          />
        )
        break;
      }


      case 'text': {

        result = getFieldDecorator(attribute.index, {
          rules
        })(

          <DebounceInput
            disabled={attribute.readonly}
            placeholder={placeholder}
            addonAfter={addonAfter}
          />

        )
        break;

      }

      case 'switch': {
        result = getFieldDecorator(attribute.index, {
          valuePropName: 'checked'
        })(
          <Switch disabled={attribute.readonly}/>
        );
        break;
      }

      case 'slider': {
        result = getFieldDecorator(attribute.index)(
          <Slider />
        );
        break;
      }

      case 'display': {
        result = <span className="ant-form-text">value</span>
        break
      }

      case 'section': {

        result = <div className="pv-10">
          {attribute.name ? <label className="bold large-text">{attribute.name}</label> : null}
          <hr/>
        </div>;
        break;
      }

      case 'separator': {
        result = <div><hr/></div>;
        break;
      }


      case 'date': {
        result = getFieldDecorator(attribute.index,{
          rules
        })(
          <DatePicker
            disabled={attribute.readonly}
            style={{width: '100%'}}
            format="DD.MM.YYYY"

          />
        );

        break;
      }

      case 'datetime': {
        result = getFieldDecorator(attribute.index,{
          rules
        })(
          <DatePicker
            disabled={attribute.readonly}
            showTime
            format="DD.MM.YYYY HH:mm:ss"

          />
        );

        break;
      }

      case 'datetimerange': {

        result = getFieldDecorator(attribute.index , {
          rules
        })(
          <RangePicker
            disabled={attribute.readonly}
            showTime
            format="DD.MM.YYYY HH:mm" />
        )

        break;
      }

      case 'daterange': {

        result = getFieldDecorator(attribute.index , {
          rules,
        })(
          <RangePicker
            disabled={attribute.readonly}
            format="DD.MM.YYYY" />
        )

        break;
      }

      case 'dropdowncheckbox': {
        result = getFieldDecorator(attribute.index , {
          rules,
        })(
          <CheckboxGroup
            disabled={attribute.readonly}
          >
            <Dropdown {...config} overlay={
              config && config.loaderConfig ? (
                <MenuAsync
                  loaderConfig={config.loaderConfig}
                />
              ) : <Menu>
                {attribute.optionValues.map((item, index) => (<Menu.Item key={item.value}><Checkbox  className={"p-0 m-0"} value={item.value}>{item.name}</Checkbox></Menu.Item>))}
              </Menu>}
              >{_.get(attribute,'inputTypeOptions.useLabel',false) ? <span>
              {attribute.name || _.get(attribute,'inputTypeOptions.placeholder')} <Icon type="down" />
            </span> : <Button>
              {attribute.name || _.get(attribute,'inputTypeOptions.placeholder')} <Icon type="down" />
            </Button>}</Dropdown>

          </CheckboxGroup>
        )
        break;
      }

      case 'checkbox': {

        if (attribute.optionValues && attribute.optionValues.length){
          result = getFieldDecorator(attribute.index , {
            rules
          })(
            <CheckboxGroup options={attribute.optionValues.map(item => ({
              label: item.name,
              value: attributeTypeValue(attribute.type, item.value)
            }))}/>
          )
        }else {
          result = getFieldDecorator(attribute.index , {
            rules,
            valuePropName: 'checked'
          })(
            <Checkbox>{_.get(attribute,'inputTypeOptions.hint')}</Checkbox>,
          )
        }
        break;
      }

      case 'radio': {

        const radioStyle = {
          display: 'block',
          height: '30px',
          lineHeight: '30px',
        };
        if (attribute.optionValues && attribute.optionValues.length){
          result = getFieldDecorator(attribute.index , {
            rules
          })(
            <Radio.Group>
              {attribute.optionValues.map((item, index)=> (
                <Radio key={`${index}`} style={radioStyle} value={attributeTypeValue(attribute.type, item.value)}>{item.name}</Radio>
              ))}
            </Radio.Group>
          )
        }else {
          result = getFieldDecorator(attribute.index , {
            rules
          })(
            <Radio.Group>
              <Radio style={radioStyle} value={true}>{t('Yes')}</Radio>
              <Radio style={radioStyle} value={false}>{t('No')}</Radio>
            </Radio.Group>
          )
        }
        break;
      }

      case 'multiselect':
      case 'select': {

        result = getFieldDecorator(attribute.index, {
          rules
        })(
          config && config.loaderConfig ? (
            <SelectAsync
              disabled={attribute.readonly}
              {...config}
              mode={
                attribute.inputType.toLowerCase() === 'multiselect'
                  ? 'tags'
                  : 'default'
              }
              options={attribute.optionValues ? attribute.optionValues.map(item => ({
                label: item.name,
                value: item.value
              })): null}
              placeholder={placeholder}
            />
          ) : (
            !attribute.optionValues || !attribute.optionValues.length ?
              <Input
                disabled={attribute.readonly}
                placeholder={placeholder}
              />
              :
              <Select
                disabled={attribute.readonly}
                {...config}
                mode={
                  _.get(attribute,'inputTypeOptions.mode',attribute.inputType.toLowerCase() === 'multiselect'
                    ? 'tags'
                    : 'default')

                }
                placeholder={placeholder}
              >
                {attribute.optionValues.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.name}
                  </Option>
                ))}
              </Select>
          ),
        )



        break;
      }

      case 'table': {

        result = getFieldDecorator(attribute.index , {
          rules
        })(
          <EditTable
            columns={[]}
          />
        )
        break;
      }


      case 'autocomplete': {

        result = getFieldDecorator(attribute.index , {
          rules
        })(
          <Autocomplete {...config}
                        placeholder={placeholder}
          />
        )
        break;

      }

      case 'file': {

        result = getFieldDecorator(attribute.index , {
          rules
        })(
          <File
            style={{margin: '8px 0'}}
            {...config}
                imageOnly={rules.reduce((acc, cur)=>{
                  if (!acc){
                    return cur.index === 'image'
                  }
                  return acc;
                },false)}
                multiple={false}
                placeholder={placeholder}
          />
        )
        break;

      }

      case 'files': {

        result = getFieldDecorator(attribute.index , {
          rules
        })(
          <File
            style={{margin: '8px 0'}}
            {...config}
                imageOnly={rules.reduce((acc, cur)=>{
                  if (!acc){
                    return cur.index === 'image'
                  }
                  return acc;
                },false)}
                multiple={true}
                placeholder={placeholder}
          />
        )
        break;

      }

      case 'tablepicker': {
        result = getFieldDecorator(attribute.index , {
          rules
        })(

          <TablePicker
            columns={config.columns}
            loaderConfig={config.loaderConfig}
            searchPlaceholder={placeholder}
          />
        )
        break;
      }


      case 'button': {

        result = getFieldDecorator(attribute.index , {
          rules
        })(
          <Button {...config}>{attribute.name || placeholder}</Button>
        )
        break;
      }

      case 'attempt': {

        result = getFieldDecorator(attribute.index , {
          rules
        })(
          <AttemptResultInput />
        )
        break;
      }


      default: {}
    }
    return result;
  }


  static renderDisplayAttribute(attribute: Attribute, form: {getFieldDecorator: Function, getFieldValue: Function}, t, val){


    const value = val || form.getFieldValue(attribute.index);
    const config = FormFactory.getConfigForAttribute(attribute);
    let result = <span>{"-"}</span>;

    if (!value || (_.isArray(value) && !value.length)){
      return result;
    }

    if (config.loaderConfig){
      return <DataLoaderValueLabel loaderConfig={config.loaderConfig} value={value} />
    }

    switch(attribute.inputType.toLowerCase()){

      case 'date': {
        result = <OneLineLabel>{moment(value).format('LL')}</OneLineLabel>
        break;
      }

      case 'datetime': {
        result = <OneLineLabel>{moment(value).format('LLL')}</OneLineLabel>
        break;
      }

      case 'datetimerange': {

        if (value.length === 2){
          result = <OneLineLabel>{moment(value[0]).format('LLL')} - {moment(value[1]).format('LLL')}</OneLineLabel>
        }else if (value.length){
          result = <OneLineLabel>{moment(value[0]).format('LLL')}</OneLineLabel>
        }

        break;
      }

      case 'daterange': {

        if (value.length === 2){
          result = <OneLineLabel>{moment(value[0]).format('LL')} - {moment(value[1]).format('LL')}</OneLineLabel>
        }else if (value.length){
          result = <OneLineLabel>{moment(value[0]).format('LL')}</OneLineLabel>
        }
        break;
      }

      case 'checkbox':
      case 'dropdowncheckbox':
      case 'multiselect':
      case 'select': {

        const option = _.find(attribute.optionValues,{value});
        if (option){
          result = <OneLineLabel>{option.name}</OneLineLabel>
        }else if (config && config.loaderConfig) {
          result = <OneLineLabel><LoaderConfigLabel loaderConfig={config.loaderConfig}/></OneLineLabel>
        }else if (_.isBoolean(value)){
          result = value ? <Icon type="check-square" /> : <Icon type="close-square" />
        } else {
          result = <OneLineLabel></OneLineLabel>
        }
        break;
      }

      case 'attempt': {
        result = <AttemptDisplayLabel attempt={value}/>
        break;
      }


      default: {
        result = <OneLineLabel>{value}</OneLineLabel>
      }

    }

    return result;
  }
}

export default FormFactory;
