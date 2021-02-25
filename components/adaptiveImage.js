import styled from "@emotion/styled";
const ImageParent = styled.div({ position: 'relative' }, (props) => ({
  height: props.height,
}));
const Image = styled.img`
  object-fit:cover;
  width:100%;
  height:100%;
  object-position:${props=>props.objectPosition}
`

export default function AdaptiveImage({ height, src, alt, objectPosition }) {
  return (
    <ImageParent height={height}>
      <Image
        src={src}
        alt={alt}
        objectPosition={objectPosition}
      />
    </ImageParent>
  );
}
