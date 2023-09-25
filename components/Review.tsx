import clsx from "clsx";

interface MovieProps {
  title: string;
  release_date: string;
  link: string;
  fun_before: boolean;
  fun_during: boolean;
  fun_after: boolean;
}

export default function Review(review: MovieProps) {
  return (
    <div flex="" justify="between">
      <a
        className="@hover-underline italic font-bold"
        href={review.link}
        target="_blank"
      >
        {`${review.title} (${review.release_date?.slice(0, 4)})`}
      </a>
      <span className="float-right text-xl whitespace-pre">
        <span
          title="hype"
          className={clsx(!review.fun_before && "grayscale opacity-50", "ml-1")}
        >
          🔥
        </span>
        <span
          title="like"
          className={clsx(!review.fun_during && "grayscale opacity-50", "ml-1")}
        >
          ❤️
        </span>
        <span
          title="nice"
          className={clsx(!review.fun_after && "grayscale opacity-50", "ml-1")}
        >
          ⭐
        </span>
      </span>
    </div>
  );
}
