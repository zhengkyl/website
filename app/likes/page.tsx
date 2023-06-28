import MovieReview from "../../components/Review";
import Song from "../../components/Song";
import { getMovieReviews } from "../../lib/server/review";
import {
  getCurrentSong,
  getLastPlayed,
  getLikedSongs,
} from "../../lib/server/spotify";

export default async function Page() {
  const positiveReviews = await getMovieReviews({
    per_page: 3,
    category: "Film",
    status: "Completed",
    sort_by: "created_at.desc",
    fun_during: true,
    fun_after: true,
  });
  const lastReview = (
    await getMovieReviews({
      per_page: 1,
      category: "Film",
      status: "Completed",
      sort_by: "created_at.desc",
    })
  )[0];

  const currentSong = await getCurrentSong();
  const lastSong = (await getLastPlayed({ limit: 1 }))[0];

  const songs = await getLikedSongs({ limit: 3 });

  return (
    <>
      <div>
        <h2 className="inline mr-2">movies</h2>
      </div>
      <p className="pt-2">just watched</p>
      <MovieReview {...lastReview} />
      <p className="pt-2">good movies</p>
      <ul>
        {positiveReviews.map((movie) => (
          <MovieReview {...movie} />
        ))}
      </ul>
      <div className="mt-8">
        <h2 className="inline mr-2">songs</h2>
      </div>
      {currentSong ? (
        <>
          <p className="mt-2">listening to</p>
          <Song {...currentSong} />
        </>
      ) : (
        <>
          <p className="mt-2">was listening to</p>
          <Song {...lastSong} />
        </>
      )}
      <p className="mt-2">good songs</p>
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
