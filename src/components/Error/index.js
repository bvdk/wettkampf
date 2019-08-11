// @flow
import React, {Component} from "react"
import {Alert} from 'antd';
import _ from 'lodash'
import Strings from "../../constants/strings";

type ErrorStatusEnum = 'default' | '404';

type Props = {
  t: Function,
  error?: any,
  title?: string,
  description?: string | any,
  type?: string,
  onRetry?: Function,
  closeText?: string,
  closeable?: boolean,
  onClose?: Function,
  status?: ErrorStatusEnum
};

class Error extends Component<Props> {

    static defaultProps = {
      type: "error",
      status: 'default'
    }

    componentDidMount(){

    }

    renderContent(){

      const {status, t, error} = this.props;



      switch(status){
        case '404': {
          return <Alert message={this.props.title || _.get(error,'name', '404')}
                        description={this.props.description || _.get(error,'message',t('Content not found'))}
                        type={this.props.type}
                        closable={this.props.closeable }
                        closeText={this.props.closeText }
                        onClose={this.props.onClose }
          />
        }
          default: {}
      }


      return <Alert message={this.props.title || _.get(error,'name', Strings.errorOccurred)}
                    description={this.props.description || _.get(error,'message',error ? error.toString() : 'An error occurs please try it again')}
                    type={this.props.type}
                    closable={this.props.closeable }
                    closeText={this.props.closeText }
                    onClose={this.props.onClose }
      />
    }

    render(){



      return <div>
        {
          this.renderContent()
        }

      </div>;
    }

}

export default Error;
