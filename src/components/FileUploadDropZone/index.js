// @flow
import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import * as axios from "axios";
import {message} from "antd";
import _ from "lodash";
import Loader from "../Loader";


type Props = {
  t: Function,
  children: any,
  dropzoneProps: any,
  onUploaded?: (response: any) => void,
};

type State = {
  loading: boolean
}

class FileUploadDropZone extends Component<Props, State> {

  state = {
    loading: false,
  }

  getHeader(){

    return {

    }
  }

  uploadFile(file): Promise<{
    response: any,
    blob: any,
  }>{
    const formData = new FormData();
    formData.append('file', file );

    return axios.post('/file', formData,{
      headers: this.getHeader()
    }).then(response => {
      return response.data
    })
  }

  handleDrop = (file: File) => {

    const {t} = this.props;

    this.setState({
      loading: true,
    }, () => {
      this.uploadFile(file)
        .then((result)=>{
          const {onUploaded} = this.props;
          if (onUploaded) onUploaded(result);
        })
        .catch((err)=>{
          console.error(err);
          message.error(_.get(err,'message',t('Could not upload file')));
        })
        .finally(()=>{
        this.setState({
          loading: false
        })
      })
    })
  }

  render() {
    const { dropzoneProps } = this.props;
    const { loading } = this.state;

    return  <div style={{position: 'relative'}}>
      <Dropzone
        disableClick
        onClick={()=>{}}
        {...dropzoneProps}
        onDrop={this.handleDrop}
      >
        {this.renderChildren}
      </Dropzone>
      { loading ? <Loader absolute mask hideTitle /> : null}
    </div>;
  }

  renderChildren = (dropzoneState) => {
    const { children} = this.props;
    if (typeof children === 'function') {
      return children(dropzoneState)
    }
    return children
  }
}

export default FileUploadDropZone
