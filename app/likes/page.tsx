import Review from "../../components/Review";
import Song from "../../components/Song";
import { getMovieReviews } from "../../lib/server/review";
import { getPreviousSongs } from "../../lib/server/spotify";

export default async function Page() {
  const previousReviews = await getMovieReviews({
    per_page: 5,
    category: "Film",
    status: "Completed",
    sort_by: "created_at.desc",
  });

  const previousSongs = await getPreviousSongs({ limit: 1 });

  return (
    <>
      <div>
        <h2 className="inline mr-2">movies</h2>
      </div>
      <p className="pt-2">recently watched</p>
      {previousReviews.length ? (
        <ul>
          {previousReviews.map((movie) => (
            <li key={movie.poster_path}>
              <Review {...movie} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-rose-600">error loading movies...</div>
      )}
      <div className="mt-8">
        <h2 className="inline mr-2">songs</h2>
      </div>
      <p className="mt-2">recently listened to</p>
      {previousSongs.length ? (
        <ul>
          {previousSongs.map((song) => (
            <li key={song.link}>
              <Song {...song} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-rose-600">error loading songs...</div>
      )}
    </>
  );
}
