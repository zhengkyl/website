import Link from "next/link";
import MovieReview from "../../components/Review";
import Song from "../../components/Song";
import { getMovieReviews } from "../../lib/server/review";
import { getLikedSongs } from "../../lib/server/spotify";

export default async function Page() {
  const reviews = await getMovieReviews();

  const songs = await getLikedSongs({ limit: 3 });

  return (
    <>
      <div>
        <h2 className="inline mr-2">movies</h2>
        <Link href="/likes/movies" className="hover:underline">
          <small>see more</small>
        </Link>
      </div>
      <p>my recommendations</p>
      <ul>
        {reviews.map((movie) => (
          <MovieReview {...movie} />
        ))}
      </ul>
      <div className="mt-8">
        <h2 className="inline mr-2">songs</h2>
        <Link href="/likes/songs" className="hover:underline">
          <small>see more</small>
        </Link>
      </div>
      <p>recent bops</p>
      <ul>
        {songs.map((song) => (
          <li>
            <Song {...song} />
          </li>
        ))}
      </ul>
    </>
  );
}
