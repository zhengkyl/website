import { NextResponse } from "next/server";
import {
  defaultSongData,
  getCurrentSong,
  getLastPlayed,
} from "../../../lib/server/spotify";

export async function GET() {
  const response = await getCurrentSong();
  let song;
  let playing;
  if (response.status === 200) {
    const results = await response.json();
    song = results.item;
    playing = true;
  } else {
    const response = await getLastPlayed();
    if (!response.ok) {
      return defaultSongData;
    }
    const results = await response.json();
    song = results.items[0].track;
    playing = false;
  }

  return NextResponse.json({
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
