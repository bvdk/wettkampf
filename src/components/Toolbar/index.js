// @flow
import React, {Component} from 'react';

type Props = {
    borderBottom: boolean,
    renderLeft?: ?Function,
    renderRight?: ?Function,
    renderMiddle?: ?Function,
    style: ?any,
};

export default class Toolbar extends Component<Props> {
    props: Props;

    static defaultProps = {
        borderBottom: false,
        renderLeft: null,
        renderRight: null,
        renderMiddle: null,
        style: {}
    }

    render() {

        const {style, renderLeft, renderRight, renderMiddle, borderBottom, className} = this.props

        return (
            <div
              className={`toolbar ${className ? className : ''}`}
              style={{
                flexWrap: 'wrap',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '8px 16px',
                borderBottom: borderBottom ? '1px solid #ccc' : null,
                ...style
            }}>
                <div style={{

                    order: '0 !important'
                }}
                >{renderLeft ? renderLeft() : null}
                </div>
                <div style={{
                    order: '1 !important',
                    flex: 1
                }}
                >{renderMiddle ? renderMiddle() : null}
                </div>
                <div style={{
                    order: '2 !important'
                }}
                >{renderRight ? renderRight() : null}
                </div>
            </div>
        );
    }
}
