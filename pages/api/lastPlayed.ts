import { getCurrentSong, getLastPlayed } from "../../lib/server/spotify";

export default async function (_, res) {
  const response = await getCurrentSong();

  let song;
  let playing;
  if (response.status === 200) {
    const results = await response.json();
    song = results.item;
    playing = true;
  } else {
    const response = await getLastPlayed();
    const results = await response.json();
    song = results.items[0].track;
    playing = false;
  }

  return res.status(200).json({
    title: song.name,
    imageUrl: song.album.images[0].url,
    artists: song.artists.map((artist) => ({
      name: artist.name,
      link: artist.external_urls.spotify,
    })),
    link: song.external_urls.spotify,
    playing: playing,
  });
}
