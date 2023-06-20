import Link from "next/link";
import { getLatestReviewAndMovie } from "../lib/server/movielo";
import Home from "./Home";

export default async function HomePage() {
  // const movieData = await getLatestReviewAndMovie();
  // return <Home movieData={movieData} />;
  return (
    <>
      <h1>Kyle Zheng</h1>
      <p></p>
      <Link href="/makes">
        <h2>/makes</h2>
      </Link>
      <Link href="/likes">
        <h2>/likes</h2>
      </Link>
    </>
  );
}
