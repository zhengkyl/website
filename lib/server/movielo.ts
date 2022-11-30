// const GALLERY_ID = process.env.MOVIELO_GALLERY_ID

// const MOVIELO_ENDPOINT = `https://us-central1-movielo.cloudfunctions.net/api/galleries/${GALLERY_ID}/movies?sortBy=date&order=desc&limit=1`

// export async function getLastWatched() {
//   return fetch(MOVIELO_ENDPOINT)
// }

const REVIEW_API_USER = process.env.REVIEW_API_USER;
const REVIEW_API_PASS = process.env.REVIEW_API_PASS;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const AUTH_ENDPOINT = "https://review-api.fly.dev/auth";
const REVIEWS_ENDPOINT =
  "https://review-api.fly.dev/reviews?per_page=1&category=Film&status=Completed&sort_by=created_at.desc";

const getMovieDataUrl = (movieId) =>
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`;

const getSessionCookie = async () => {
  const resp = await fetch(AUTH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: REVIEW_API_USER, password: REVIEW_API_PASS }),
  });

  const setCookie = resp.headers.get("Set-Cookie");

  /** Just keep cookie from `id=blahblah; HttpOnly; SameSite=Lax; Secure; Path=/ etc....` */
  return setCookie.substring(0, setCookie.indexOf(";"));
};

export const getLatestReviewAndMovie = async () => {
  const reviewResp = await fetch(REVIEWS_ENDPOINT, {
    headers: {
      Cookie: await getSessionCookie(),
    },
  });
  const reviewData = await reviewResp.json();

  const review = reviewData.results[0];

  if (review == null) {
    return null;
  }

  const dataResp = await fetch(getMovieDataUrl(review.tmdb_id));
  const movie = await dataResp.json();

  return {
    title: movie.title,
    link: `https://www.themoviedb.org/movie/${movie.id}`,
    fun_before: review.fun_before,
    fun_during: review.fun_during,
    fun_after: review.fun_after,
  };
};
