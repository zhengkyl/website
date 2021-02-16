import {getLastPlayed} from "../../src/spotify"

export default async function(_, res) {
  const response = await getLastPlayed()
//TODO status checking
  const results = await response.json()
  const song = results.items[0]
  const playing = (Date.now() - new Date(song.played_at)) < song.track.duration_ms
  return res.status(200).json({
    title:song.track.name,
    imageUrl: song.track.album.images[0].url,
    artist:song.track.artists.map(artist=>artist.name).join(", "),
    link:song.track.external_urls.spotify,
    playing: playing,
  })
}