// @flow
import React, { Component } from 'react';
import {Alert, Upload, Icon, Spin, message, Row, Col} from "antd";
import AttributesInlineForm from "../Form/attributes-inline-form";
import Panel from "../Panel";

const Dragger = Upload.Dragger;

type Props = {

};

type State = {
  defaultValues: any
}

class AthleteImport extends Component<Props, State> {

  state = {
    defaultValues: {}
  }

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

        <Row gutter={32}>
          <Col md={16}>
            <Dragger
                data={this.state.defaultValues}
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
          </Col>
          <Col md={8}>
            <Panel
                title={"Einstellungen"}
                bordered={true}>
              <p>Folgende Einstellungen können als Standardwerte für den Athleten-Import festgelegt werden.</p>
              <AttributesInlineForm
                  onChange={(defaultValues) => this.setState({
                    defaultValues
                  })}
                  values={this.state.defaultValues}
                  attributes={[{
                    index: "raw",
                    type: "bool",
                    inputType: "checkbox",
                    name: "Raw"
                  }]}
                  useSubmit={false}
              />
            </Panel>
          </Col>
        </Row>

        {error ? <Alert message={error} type="error" /> : null}

      </div>

    );
  }
}

export default AthleteImport;
