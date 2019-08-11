// @flow
import React from 'react';
import classNames from 'classnames';
import loaderStyles from './Loader.css';
import {Icon, Spin} from "antd";

type Props = {
  t: Function,
  spinning?: boolean,
  mask?: boolean,
  fullScreen?: boolean,
  size?: string,
  absolute?: boolean,
  useIcon?: boolean,
  hideTitle?: boolean,
  styles?: any,
}

class Loader extends React.Component<Props> {
  static defaultProps = {
    spinning: true,
    fullScreen: false,
    useIcon: false,
  };

  render() {

    const { spinning, fullScreen , size, absolute, mask, useIcon, styles, hideTitle } = this.props;

    if (useIcon){
      const antIcon = <Icon type="loading" style={styles} spin />;
      return <Spin indicator={antIcon} />
    }

    if (size === 'small'){
      return <Spin size={'small'} className={classNames('loader small', {
        mask,
        [loaderStyles.absolute]: absolute,
      })}/>
    }

    return (
      <div
        className={classNames('loader large', {
          mask,
          absolute: absolute || size === 'fullScreen',
          hidden: !spinning,
          fullScreen: fullScreen || size === 'fullScreen',
        })}
      >
        <div className={'wrapper'}>
          <div className={'inner'} />
          {!hideTitle ? <div className={'text'}>{'LOADING'}</div> : null}

        </div>
      </div>
    );
  }
}

export default Loader;

