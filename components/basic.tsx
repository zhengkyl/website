import classnames from "classnames";
import React, { ReactNode } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { theme } from "../styles/global";

export const Container = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={classnames("px-8 max-w-screen-lg m-auto", className)}
    {...props}
  >
    {children}
  </div>
);

const SectionTitleParent = styled.div`
  margin-top: 90px;
  margin-bottom: 32px;
`;

type SectionTitleWithBarProps = {
  id?: string;
  children?: React.ReactNode;
};
export function SectionTitleWithBar({
  children,
  id,
}: SectionTitleWithBarProps) {
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
  line-height: 48px;
  margin-right: 16px;
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
    cursor: pointer;
  }
  &:last-child {
    margin-right: 0;
  }
`;
export function LinkButton({ children, ...props }) {
  return (
    <a css={linkButtonStyle} target="_blank" rel="noopener" {...props}>
      {children}
    </a>
  );
}
const ChipContainer = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.23);
  font-size: 16px;
  height: 32px;
  margin: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  & > span {
    padding-left: 12px;
    padding-right: 12px;
  }
`;
export function Chip({ children }) {
  return (
    <ChipContainer>
      <span>{children}</span>
    </ChipContainer>
  );
}
