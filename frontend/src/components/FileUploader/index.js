// @flow
import React, {Component} from "react"
import {Icon, message, Upload} from 'antd';
import * as axios from "axios";
import base64ImageToBlob from "../../utils/base64File";

const Dragger = Upload.Dragger;

type Size = 'small' | 'large';

type Props = {
  multiple: boolean,
  accept: string,
  onChange: (fileList: any[] )=> void,
  onUpload: Function,
  hideSuccessMessages: boolean,
  autoRemove: boolean,
  size: Size
}

class FileUploader extends Component<Props> {

  constructor(props){
    super(props)

    this.filesMap = {};
    this.uploadedFilesMap = {};

    this.state = {
      loading: false,
      editImage: undefined,
      fileList: [],
    }

  }

  componentDidMount(){

  }

  getHeader(){
    const token = this.props.token;
    return {
      authorization: token ? `Bearer ${token}` : null,
    }
  }

  uploadBase64File(data, oldFile){
    const formData = new FormData();
    const blob =  base64ImageToBlob(data);
    formData.append('file', blob, oldFile.name);

    return axios.post('/file', formData,{
      headers: this.getHeader()
    }).then(response => {
      const {size, type} = blob;
      return {
        response: response.data,
        blob: {
          size,
          type
        }
      }
    })
  }

  triggerChange(fileList){
    if (this.props.onChange){
      this.props.onChange(fileList);
    }
  }

  render(){

    const  {multiple, accept, hideSuccessMessages, autoRemove, size } = this.props;

    const {fileList} = this.state;

    const draggerProps = {
      fileList,
      accept,
      name: 'file',
      multiple,
      showUploadList: true,
      listType: 'picture',
      action: '/file',
      headers: this.getHeader(),
      onChange: (info) => {

        let fileList = info.fileList;
        if (!this.props.multiple && fileList.length > 1){
          fileList = [fileList[fileList.length-1]];
        }

        if (autoRemove){
          fileList = fileList.filter((item)=>{
            return item.status !== 'done';
          })
        }

        this.setState({
          fileList
        })

        const status = info.file.status;
        const response = info.file.response;
        if (status !== 'uploading') {

        }
        if (status === 'done') {
          if (!hideSuccessMessages){
            message.success(`${info.file.name} ${'file uploaded successfully'}.`);
          }
          this.uploadedFilesMap[response.id] = info.file;
          if (this.props.onUpload){
            this.props.onUpload(info.file);
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }

        this.triggerChange(fileList);

      },
    };

    return <div>
      <Dragger {...draggerProps}>
        {size === 'small' ? <div>
          <p>
            <Icon type="inbox" style={{marginRight: 16, fontSize: 18}} />
            {'Click or drag file to this area to upload'}
          </p>
        </div> : <div>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">{'Click or drag file to this area to upload'}</p>
          <p className="ant-upload-hint">
            {'Support for a single or bulk upload'}
          </p>
        </div>}

      </Dragger>


    </div>;
  }

}

export default FileUploader;
