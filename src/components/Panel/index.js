// @flow
import React, {Component} from "react"
import styled from "styled-components";
import Colors from "../../styles/colors";

type Props = {
    title?: string,
    topRight?: any,
    children?: any,
    style?: any,
    containerStyle?: any,
    bordered: boolean,
    removeBackground?: boolean,
}

const Container = styled.div`
  padding: 10px;
  border: ${(props) => (props.bordered ? `1px solid ${Colors.greyDark}` : 'none')}
`;

const Wrapper = styled.div`
  margin-top: 16px;
`;

const Headline = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
`;

class Panel extends Component<Props> {

    render() {

        const {children, title, topRight, style, containerStyle, bordered, removeBackground} = this.props;

        const ClassNames = removeBackground ? "border relative" : "white-bg border relative";

        return <Wrapper className={'Panel'} style={style}>
            <Headline>
                {title ? <p className="ph-10" style={{fontWeight: 600}}>{title}</p> : null}
                {topRight}
            </Headline>
            <Container bordered={bordered} style={containerStyle} className={ClassNames}>
                {children}
            </Container>
        </Wrapper>;
    }

}

export default Panel;
