import { addParams } from "./util";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const REVIEWS_ENDPOINT = "https://review-api.fly.dev/reviews";

const getMovieDataUrl = (movieId) =>
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`;

export const getLikedReviews = async (
  params = {
    per_page: 3,
    category: "Film",
    status: "Completed",
    sort_by: "created_at.desc",
    fun_during: true,
    fun_after: true,
  }
) => {
  const reviewResp = await fetch(addParams(REVIEWS_ENDPOINT, params), {
    next: { revalidate: 10 },
  });
  const reviewData = await reviewResp.json();

  const reviews = reviewData.results;

  return Promise.all(
    reviews.map(async (review) => {
      const dataResp = await fetch(getMovieDataUrl(review.tmdb_id));
      const movie = (await dataResp.json()) ?? defaultMovieData;

      return {
        title: movie.title,
        link: `https://www.themoviedb.org/movie/${movie.id}`,
        fun_before: review.fun_before,
        fun_during: review.fun_during,
        fun_after: review.fun_after,
      };
    })
  );
};

export const defaultMovieData = {
  fun_before: false,
  fun_during: false,
  fun_after: false,
  link: "",
  title: "nothing",
};
