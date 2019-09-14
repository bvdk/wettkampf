// @flow
import React, { Component } from 'react';
import classnames from 'classnames';
import { Table, Input, Icon, Button, Popconfirm } from 'antd';
import Loader from '../Loader';
import './EditableCell.css';

type Props = {
  value: string,
  onChange: Function,
  onRemove?: Function,
  className?: any
};

type State = {
  value: string,
  editable: boolean,
  loading: boolean
};

export default class EditableCell extends Component<Props, State> {
  isMounted: boolean = false;

  state = {
    value: this.props.value,
    editable: false,
    loading: false
  };

  escFunction = (event: { keyCode: number }) => {
    if (event.keyCode === 27 && this.state.editable) {
      this.setState({
        editable: false
      });
    }
  };

  componentDidMount() {
    this.isMounted = true;
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillUnmount() {
    this.isMounted = false;
    document.removeEventListener('keydown', this.escFunction, false);
  }

  handleChange = e => {
    const { value } = e.target;
    this.setState({ value });
  };

  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.setState(
        {
          loading: true
        },
        () => {
          const promise = this.props.onChange(this.state.value);
          if (promise) {
            promise
              .then(() => {
                this.setState({
                  loading: false
                });
              })
              .catch(() => {
                this.setState({
                  loading: false
                });
              });
          }
        }
      );
    }
  };

  edit = () => {
    this.setState({ editable: true });
  };

  onRemove = () => {
    if (this.props.onRemove) {
      this.setState(
        {
          loading: true
        },
        () => {
          const promise = this.props.onRemove();
          if (promise) {
            promise
              .then(() => {})
              .finally(() => {
                if (this.isMounted) {
                  this.setState({
                    loading: false
                  });
                }
              });
          }
        }
      );
    }
  };

  render() {
    const { value, editable, loading } = this.state;
    return (
      <div className={classnames('editable-cell', this.props.className)}>
        {loading ? <Loader size={'small'} mask={true} /> : null}
        {editable ? (
          <div className="editable-cell-input-wrapper">
            <Input
              value={value}
              onChange={this.handleChange}
              onPressEnter={this.check}
            />
            <Icon
              type="check"
              className="editable-cell-icon-check"
              onClick={this.check}
            />
          </div>
        ) : (
          <div className="editable-cell-text-wrapper">
            {value || ' '}
            <div className="editable-cell-icon-wrapper">
              <Icon type="edit" onClick={this.edit} />
              {this.props.onRemove ? (
                <Icon type="delete" onClick={this.onRemove} />
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  }
}
