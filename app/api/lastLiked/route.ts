import { NextResponse } from "next/server";
import { getLastLiked } from "../../../lib/server/spotify";

export async function GET() {
  const response = await getLastLiked();
  const results = await response.json();
  const song = results.items[0];

  return NextResponse.json({
    title: song.track.name,
    imageUrl: song.track.album.images[0].url,
    artists: song.track.artists.map((artist) => ({
      name: artist.name,
      link: artist.external_urls.spotify,
    })),
    link: song.track.external_urls.spotify,
  });
}
