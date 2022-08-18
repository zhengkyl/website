import { getLastLiked } from "../../server/spotify";

export default async function (_, res) {
  const response = await getLastLiked();
  const results = await response.json();
  const song = results.items[0];

  return res.status(200).json({
    title: song.track.name,
    imageUrl: song.track.album.images[0].url,
    artist: song.track.artists.map((artist) => artist.name).join(", "),
    link: song.track.external_urls.spotify,
  });
}
