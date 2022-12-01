const TMDB_API_KEY = process.env.TMDB_API_KEY;

const REVIEWS_ENDPOINT =
  "https://review-api.fly.dev/reviews?per_page=1&category=Film&status=Completed&sort_by=created_at.desc";

const getMovieDataUrl = (movieId) =>
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`;

export const getLatestReviewAndMovie = async () => {
  const reviewResp = await fetch(REVIEWS_ENDPOINT);
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
