const GALLERY_ID = process.env.MOVIELO_GALLERY_ID

const MOVIELO_ENDPOINT = `https://us-central1-movielo.cloudfunctions.net/api/movies/${GALLERY_ID}?limit=1`

export async function getLastWatched() {
  return fetch(MOVIELO_ENDPOINT)
}
//more to be added?