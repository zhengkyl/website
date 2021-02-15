import {getLastPlayed} from "../../src/spotify"

export default async function(_, res) {
  const response = await getLastPlayed()
//TODO status checking
  const results = await response.json()
  const song = results.items[0]

  return res.status(200).json({
    title:song.track.name,
    imageUrl: song.album.images[0].url,
    artist:song.artists.map(artist=>artist.name).join(", "),
    link:song.external_urls.spotify
  })
}