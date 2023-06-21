import Link from "next/link";
import { getLatestReviewAndMovie } from "../lib/server/movielo";
import Home from "./Home";

export default async function HomePage() {
  // const movieData = await getLatestReviewAndMovie();
  // return <Home movieData={movieData} />;
  return (
    <>
      <h1>I need job.</h1>
      <p className="my-4">
        I'm looking for frontend/backend/fullstack opportunities. I'm confident
        in my ability to learn any skills or tech stack.
      </p>
      <p className="my-4">
        I've worked on "insert internship stuff frontend" and backend side
        projects and job, and dumb stuff "link to dumb stuff".
      </p>
      <p className="my-4">
        I am selective about what I care about, but I have objectively good
        taste where it counts.
      </p>
      <p className="my-4">Here are some things I like.</p>
      <Link href="/makes">
        <h2>/makes</h2>
      </Link>
      <Link href="/likes">
        <h2>/likes</h2>
      </Link>
    </>
  );
}
