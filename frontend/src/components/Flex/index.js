// @flow
import React, { Component } from 'react';
import classNames from 'classnames';

type Props = {
  children?: any,
  className?: any
};

export const Row = (props: Props) => {
  const { className, children, style } = props;
  return (
    <div style={style} className={classNames('flex-row', className)}>
      {children}
    </div>
  );
};

export const Col = (props: Props) => {
  const { className, children, style } = props;
  return (
    <div style={style} className={classNames('flex-col', className)}>
      {children}
    </div>
  );
};

export const Grow = (props: Props) => {
  const { className, children, style } = props;
  return (
    <div
      style={style}
      className={classNames('flex-grow-1', 'grow-size-overflow', className)}>
      {children}
    </div>
  );
};
