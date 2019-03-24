import styled from "styled-components";

const OneLineLabel = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: block;
  max-width: ${(props)=> `${props.maxWidth}px` || '200px'}
`;

export default OneLineLabel;
