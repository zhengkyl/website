import { addParams } from "./util";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const REVIEWS_ENDPOINT = "https://review-api.fly.dev/reviews";

const getMovieDataUrl = (movieId) =>
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`;

type SortField = "tmdb_id" | "created_at" | "updated_at";
type SortType = "asc" | "desc";

type ReviewParams = {
  per_page?: number;
  category?: "Film" | "Show";
  status?: "Completed" | "PlanToWatch" | "Watching" | "Dropped";
  sort_by?: `${SortField}.${SortType}`;
  fun_before?: boolean;
  fun_during?: boolean;
  fun_after?: boolean;
  user_id?: number;
};

export const getMovieReviews = async (params: ReviewParams) => {
  let reviewData;
  try {
    const reviewResp = await fetch(addParams(REVIEWS_ENDPOINT, params), {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(2000),
    });
    reviewData = await reviewResp.json();
  } catch (e) {
    return [];
  }

  const reviews = reviewData.results;
  const results = await Promise.allSettled(
    reviews.map(async (review) => {
      const dataResp = await fetch(getMovieDataUrl(review.tmdb_id), {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(1000),
      });
      const movie = await dataResp.json();

      return {
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        link: `https://www.themoviedb.org/movie/${movie.id}`,
        fun_before: review.fun_before,
        fun_during: review.fun_during,
        fun_after: review.fun_after,
      };
    })
  );
  return (
    results
      .filter((result) => result.status === "fulfilled")
      // @ts-ignore literally checked in line above
      .map((result) => result.value)
  );
};

export const defaultMovieData = {
  fun_before: false,
  fun_during: false,
  fun_after: false,
  link: "",
  title: "nothing",
};
