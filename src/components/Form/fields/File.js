// @flow
import React, {Component} from "react"
import _ from 'lodash';
import {compose} from "react-apollo/index";
import FileUploader from "./../../FileUploader";
import Sizes from "../../../styles/sizes";

type Props = {
  value: ?any,
    file: ?any,
  onChange: ?Function,
  style: ?any,
  placeholder: string,
  imageOnly: boolean,
  multiple: boolean,
  previews: {
    id: number,
    link: string
  }[]
}

class File extends Component<Props> {

  static defaultProps = {
    multiple: true
  }

  onChange = (value) => {
      let val = value.map(item => _.get(item, 'response.fileId'));
      if (!this.props.multiple) {
          val = _.first(val);
      }
      this.triggerChange(val);
  }

  triggerChange = (changedValue) => {

    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  }

  render(){

      const {imageOnly, multiple, file, style} = this.props;

      let preview = null;

      if (file && _.get(file, 'contentType', "").startsWith("image/")) {
          preview = <img alt={file.name} style={{maxHeight: 100, maxWidth: "100%", marginBottom: Sizes.grid}}
                         src={_.get(file, "thumbnailLink")}/>
      }


      return <div style={style}>
          {preview}
          <FileUploader
              accept={imageOnly ? 'image/*' : undefined}
              multiple={multiple}
              onChange={this.onChange}
          />
      </div>
  }

}

export default compose(

)(File);
