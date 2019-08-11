// @flow
import React, {Component} from "react"

import DisplayField from "./display-field";

type Props = {
  attributes: {
    title: string,
    name: string,
    type: string,
  }[],
  values: ?any,
  labelCol: number,
  onDetailButton: ?Function,
  categories: {
    name: string,
    title: string
  }[],
  replaceCategoryInAttributeTitle: boolean
}

class DisplayForm extends Component<Props> {

    renderAttribute(attribute){
      return <DisplayField onDetailButton={this.props.onDetailButton} labelCol={this.props.labelCol} key={attribute.name} attribute={attribute} value={this.props.values ? this.props.values[attribute.name] : null}/>
    }

    render(){

      if (this.props.categories){
        return <div className="">
          {this.props.categories.map(category => <div key={category.name} className="mt-10">
            <p className="bold">{category.title}</p>
            {this.props.attributes
              .filter(item => item.categories && item.categories.indexOf(category.name) > -1 )
              .sort((a, b) => a.sortId > b.sortId)
              .map(attribute => {
                if (this.props.replaceCategoryInAttributeTitle){
                  return {
                    ...attribute,
                    title: attribute.title.replace(category.title, ''),
                  }
                }
                return attribute;
              })
              .map(attribute => this.renderAttribute(attribute))}
          </div>)}
        </div>
      }
      return <div>
        {this.props.attributes
          .sort((a, b) => a.sortId > b.sortId)
          .map(attribute => this.renderAttribute(attribute))}
      </div>;
    }

}

export default DisplayForm;
