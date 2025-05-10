import styled from "styled-components";

const PileWrapper = styled.div`
  width: 80px;
  min-height: 120px;
  border: 1px dashed #aaa;
  border-radius: 8px;
  padding: 4px;
  position: relative;
`;

function Pile({ children }) {
  return <PileWrapper>{children}</PileWrapper>;
}

export default Pile;
