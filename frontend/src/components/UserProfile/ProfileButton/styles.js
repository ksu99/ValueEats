import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 25%;
  cursor: pointer;
  font-size: 26px;
  margin-bottom: 30px;
  color: ${({ selected }) => selected && "green"};
  font-weight: ${({ selected }) => selected && "600"};
  :hover {
    opacity: 0.6;
  }
`;
