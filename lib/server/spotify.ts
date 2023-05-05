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

const LAST_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

export async function getLastPlayed() {
  const { access_token } = await getAccessToken();

  return fetch(LAST_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
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

  return fetch(CURRENT_SONG_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: {
      revalidate: 10,
    },
  });
}

const LAST_LIKED_ENDPOINT = "https://api.spotify.com/v1/me/tracks?limit=1";

export async function getLastLiked() {
  const { access_token } = await getAccessToken();

  return fetch(LAST_LIKED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: {
      revalidate: 60,
    },
  });
}
