// @flow
import React from 'react';

type Props = {
  color: string,
  height: number
};

const ColorBar = ({ height, color }: Props) => (
  <div
    style={{
      height,
      width: '100%',
      backgroundColor: color
    }}
  />
);

ColorBar.defaultProps = {
  color: '#033b77',
  height: 2
};

export default ColorBar;
