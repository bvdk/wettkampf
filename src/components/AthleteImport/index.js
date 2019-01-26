// @flow
import React, { Component } from 'react';
import {Alert, Upload, Icon, Spin, message} from "antd";

const Dragger = Upload.Dragger;

type Props = {

};

type State = {

}

class AthleteImport extends Component<Props, State> {

  state = {}

  componentDidMount() {}

  _onChangeUpload = (info) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  render() {

    const {uploading, error} = this.state;
    const {eventId} = this.props;


    return (
      <div>
        <Dragger
          name="file"
          multiple={false}
          action={`/import/${eventId}`}
          onChange={this._onChangeUpload}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Hier klicken oder Datei hier ablegen.</p>
          <p className="ant-upload-hint">Sie können hier eine CSV Datei ablegen.</p>
        </Dragger>

        { uploading ? <Spin /> : null}

        {error ? <Alert message={error} type="error" /> : null}

      </div>

    );
  }
}

export default AthleteImport;
