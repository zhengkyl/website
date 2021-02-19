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

export const SectionTitle = styled.h2`
  margin-top: 32px;
`;
export function SectionTitleWithBar({ children }) {
  return (
    <>
      <SectionTitle>{children}</SectionTitle>
      <hr />
    </>
  );
}
