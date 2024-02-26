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
    <div className="flex justify-between">
      <a
        className="@hover-underline font-semibold"
        href={review.link}
        target="_blank"
      >
        {`${review.title} (${review.release_date?.slice(0, 4)})`}
      </a>
      <span className="float-right text-xl whitespace-pre">
        <span
          title="like"
          className={` ml-1${
            !review.fun_during ? " grayscale opacity-50" : ""
          }`}
        >
          ❤️
        </span>
        <span
          title="nice"
          className={` ml-1${!review.fun_after ? " grayscale opacity-50" : ""}`}
        >
          ⭐
        </span>
      </span>
    </div>
  );
}
