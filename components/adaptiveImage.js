import styled from "@emotion/styled";
import Image from "next/image";
import { theme } from "../styles/global";
const ImageParent = styled.div({ position: 'relative' }, (props) => ({
  height: props.height,
}));

export default function AdaptiveImage({ height, src, alt, objectPosition }) {
  return (
    <ImageParent height={height}>
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        objectPosition={objectPosition}
        priority
        sizes={`${theme.standard.contentWidth}px`}
      />
    </ImageParent>
  );
}
