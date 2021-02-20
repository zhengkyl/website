import styled from "@emotion/styled";
import {css} from "@emotion/react";
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
export function SectionTitleWithBar({ children, id }) {
  return (
    <>
      <SectionTitleParent id={id}>
        <h2>{children}</h2>
        <hr />
      </SectionTitleParent>
    </>
  );
}

const SplitAlignParent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export function SplitAlign({ children }) {
  return <SplitAlignParent>{children}</SplitAlignParent>;
}

const linkButtonStyle = css`
  line-height:48px;
  
  padding: 0.35em 1.2em;
  border: 0.1em solid ${theme.colors.text};
  border-radius: 0.12em;
  box-sizing: border-box;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s;
  &:hover {
    color: ${theme.colors.background};
    background-color: ${theme.colors.text};
    cursor:pointer;
  }
`;
export function LinkButton({children, ...props}){
  return <a css={linkButtonStyle}  target="_blank" rel="noopener" {...props}>
    {children}
  </a>
}
const ChipContainer = styled.div`
  border-radius:16px;
  border:1px solid rgba(0, 0, 0, 0.23);
  font-size:16px;
  height:32px;
  margin:4px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  & > span {
    padding-left:12px;
    padding-right:12px;
  }
`
export function Chip({children}) {
  return <ChipContainer>
    <span>{children}</span>
  </ChipContainer>
}