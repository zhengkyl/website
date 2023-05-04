"use client";

import StatusBlurb from "../components/StatusBlurb";
import { Container } from "../components/basic";

export default function Home({ movieData }) {
  return (
    <Container className="mt-32">
      <StatusBlurb movieData={movieData} />
    </Container>
  );
}
