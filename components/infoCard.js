import Image from "next/image";
import styled from "@emotion/styled";
import { css, jsx } from "@emotion/react";
import { bpMq } from "../styles/global";
const cardStyle = css`
  margin-top: 32px;
  margin-bottom: 32px;
  ${bpMq[0]} {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    > div {
      flex: 1;
    }
    & > :last-child {
      margin-right: 32px;
    }
  }
`;
const altCardStyle = css`
  ${cardStyle}
  ${bpMq[0]} {
    flex-direction: row;
    & > :last-child {
      margin-right: 0;
      margin-left: 32px;
    }
  }
`;

export default function InfoCard({ children, imageSrc, imageLeft, ...others }) {
  return (
    <div {...others} css={imageLeft ? altCardStyle : cardStyle}>
      <div>

      <Image
        src={imageSrc}
        alt="FarmAssist project"
        width={600}
        height={450}
        layout="intrinsic"
        />
        </div>
      <div>{children}</div>
    </div>
  );
}
