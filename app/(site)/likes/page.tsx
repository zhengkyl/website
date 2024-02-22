import Review from "../../../components/Review";
import Song from "../../../components/Song";
import { getMovieReviews } from "../../../lib/server/review";
import { getPreviousSongs } from "../../../lib/server/spotify";

export default async function Page() {
  const previousReviews = await getMovieReviews({
    per_page: 5,
    category: "Film",
    status: "Completed",
    sort_by: "created_at.desc",
    user_id: 1,
  });

  const previousSongs = await getPreviousSongs({ limit: 1 });

  return (
    <>
      <h2 className="font-playfair font-black text-3xl">movies</h2>
      <h3 className="font-light italic text-stone-500 text-xl my-2">
        recently watched
      </h3>
      {previousReviews.length ? (
        <ul>
          {previousReviews.map((movie) => (
            <li key={movie.poster_path} className="mb-1">
              <Review {...movie} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-rose-600">error loading movies...</div>
      )}
      <h2 className="font-playfair font-black text-3xl mt-12">songs</h2>
      <h3 className="font-light italic text-stone-500 text-xl my-2">
        recently played
      </h3>
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
