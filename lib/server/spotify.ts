import { addParams } from "./util";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const BASIC = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${BASIC}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${REFRESH_TOKEN}`,
    next: {
      revalidate: 60 * 59, // 59 minutes
    },
  });

  return response.json();
}

const toSong = (song) => ({
  title: song.name,
  imageUrl: song.album.images[0].url,
  artists: song.artists.map((artist) => ({
    name: artist.name,
    link: artist.external_urls.spotify,
  })),
  link: song.external_urls.spotify,
});

const mapToSong = (item) => toSong(item.track);

const LAST_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played";

export async function getLastPlayed(
  params = {
    limit: 1,
  }
) {
  const { access_token } = await getAccessToken();

  const response = await fetch(addParams(LAST_PLAYED_ENDPOINT, params), {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    return [];
  }

  const result = await response.json();

  return result.items.map(mapToSong);
}

export const defaultSongData = {
  link: "",
  title: "nothing",
  artists: [{ name: "no one", link: "" }],
  playing: false,
};

const CURRENT_SONG_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";

export async function getCurrentSong() {
  const { access_token } = await getAccessToken();

  const response = await fetch(CURRENT_SONG_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: {
      revalidate: 10,
    },
  });

  // 204 if not currently playing
  if (response.status !== 200) {
    return null;
  }

  const result = await response.json();
  console.log(result);
  if (!result.item) {
    return null;
  }

  return toSong(result.item);
}

const LAST_LIKED_ENDPOINT = "https://api.spotify.com/v1/me/tracks";

export async function getLikedSongs(
  params = {
    limit: 1,
  }
) {
  const { access_token } = await getAccessToken();

  const response = await fetch(addParams(LAST_LIKED_ENDPOINT, params), {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    return [];
  }

  const result = await response.json();

  return result.items.map(mapToSong);
}
