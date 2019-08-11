// @flow
import React, { Component } from 'react';
import classNames from 'classnames';


type Props = {
    children?: any,
    className?: any,
};


export class Row extends Component<Props> {
    componentDidMount() {}

    render() {
        const { children, style } = this.props;

        return <div style={style} className={classNames('flex-row',this.props.className)}>{children}</div>;
    }
}

export class Col extends Component<Props> {

    render() {
        const { children, style } = this.props;

        return <div style={style} className={classNames('flex-col',this.props.className)}>{children}</div>;
    }

}


export class Grow extends Component<Props>{
    render() {
        const { children, style } = this.props;

        return <div style={style} className={classNames('flex-grow-1',this.props.className)}>{children}</div>;
    }
}