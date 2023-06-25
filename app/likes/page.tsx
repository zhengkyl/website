import { getLikedReviews } from "../../lib/server/review";
import { getLikedSongs } from "../../lib/server/spotify";

export default async function Page() {
  const reviews = await getLikedReviews();

  const songs = await getLikedSongs({ limit: 3 });
  console.log(reviews, songs);
  return (
    <>
      <p>Movies</p>
      <ul>
        {reviews.map((movie) => (
          <div>{movie.title}</div>
        ))}
      </ul>
      <p>Songs</p>
      <ul>
        {songs.map((song) => (
          <div>{song.title}</div>
        ))}
      </ul>
    </>
  );
}
