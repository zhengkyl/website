import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  & > * {
    width: 2.5em;
    margin: 0 0.5em;
    transition: all 0.3s ease-in-out 0s;
  }
  & > *:hover {
    transform: rotate(144deg);
  }
`
import Star from "../public/svgs/star.svg"
import FilledStar from "../public/svgs/star_fill.svg"

export default function StarRanking({ filled, total }) {
  return (
    <Container>
      {[...Array(total-filled)].map(()=><Star/>)}
      {[...Array(filled)].map(()=><FilledStar/>)}
    </Container>
  );
}