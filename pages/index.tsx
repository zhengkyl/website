import Link from "next/link";

import BaseLayout from "../components/BaseLayout";
import { Container, SplitAlign } from "../components/basic";
import StatusBlurb from "../components/StatusBlurb";
import Wordle from "../components/Wordle";
import { getLatestReviewAndMovie } from "../lib/server/movielo";

export async function getServerSideProps() {
  const movieData = await getLatestReviewAndMovie();
  return {
    props: { movieData },
  };
}

export default function Home({ movieData }) {
  return (
    <BaseLayout>
      <Container className="mt-32">
        <StatusBlurb movieData={movieData} />
      </Container>
    </BaseLayout>
  );
}
