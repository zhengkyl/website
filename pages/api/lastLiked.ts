import { getLastLiked } from "../../lib/server/spotify";

export default async function (_, res) {
  const response = await getLastLiked();
  const results = await response.json();
  const song = results.items[0];

  return res.status(200).json({
    title: song.track.name,
    imageUrl: song.track.album.images[0].url,
    artists: song.track.artists.map((artist) => ({
      name: artist.name,
      link: artist.external_urls.spotify,
    })),
    link: song.track.external_urls.spotify,
  });
}
