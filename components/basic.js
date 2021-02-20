import styled from "@emotion/styled";
import { bpMq } from "../styles/global";
import { theme } from "../styles/global";

export const Container = styled.div`
  max-width: ${theme.standard.contentWidth}px;
  padding: 16px;
  margin: auto;
  ${bpMq[0]} {
    padding: ${theme.standard.contentSpacing}px;
  }
  ${bpMq[1]} {
  }
  ${bpMq[2]} {
  }
`;

export const BigTitle = styled.h1``;

const SectionTitleParent = styled.div`
  margin-top: 32px;
  margin-bottom: 32px;
`;
export function SectionTitleWithBar({ children }) {
  return (
    <>
      <SectionTitleParent>
        <h2>{children}</h2>
        <hr />
      </SectionTitleParent>
    </>
  );
}

const SplitAlignParent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items:center;
`;
export function SplitAlign({ children }) {
  return <SplitAlignParent>{children}</SplitAlignParent>;
}
