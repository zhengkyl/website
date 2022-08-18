import Image, { ImageProps } from "next/image";

import { css } from "@emotion/react";

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

type InfoCardProps = {
  children?: React.ReactNode;
  imageSrc: ImageProps["src"];
  imageLeft?: boolean;
};

export default function InfoCard({
  children,
  imageSrc,
  imageLeft,
  ...others
}: InfoCardProps) {
  return (
    <div {...others} css={imageLeft ? altCardStyle : cardStyle}>
      <div>
        <Image
          src={imageSrc}
          alt="Project Showcase Image"
          width={600}
          height={450}
          layout="intrinsic"
        />
      </div>
      <div>{children}</div>
    </div>
  );
}
