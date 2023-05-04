import { getLatestReviewAndMovie } from "../lib/server/movielo";
import Home from "./Home";

export default async function HomePage() {
  const movieData = await getLatestReviewAndMovie();

  return <Home movieData={movieData} />;
}
