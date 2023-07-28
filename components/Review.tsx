interface MovieProps {
  title: string;
  release_date: string;
  link: string;
  fun_before: boolean;
  fun_during: boolean;
  fun_after: boolean;
}

const ratings = [
  "▁▁▁▁▁",
  <>
    <span className="text-lime-500">▔</span>╲▁▁▁
  </>,
  <>
    ▁╱<span className="text-lime-500">▔</span>╲▁
  </>,
  <>
    <span className="text-lime-500">▔▔▔</span>╲▁
  </>,
  <>
    ▁▁▁╱<span className="text-lime-500">▔</span>
  </>,
  <>
    <span className="text-lime-500">▔</span>╲▁╱
    <span className="text-lime-500">▔</span>
  </>,
  <>
    ▁╱<span className="text-lime-500">▔▔▔</span>
  </>,
  // eslint-disable-next-line react/jsx-key
  <span className="text-lime-400">▔▔▔▔▔</span>,
];

export default function MovieReview(review: MovieProps) {
  let index = 0;
  index += review.fun_before ? 1 : 0;
  index += review.fun_during ? 2 : 0;
  index += review.fun_after ? 4 : 0;
  return (
    <div>
      <a
        className="hover:underline italic font-bold"
        href={review.link}
        target="_blank"
      >
        {`${review.title} (${review.release_date?.slice(0, 4)})`}
      </a>
      <span className="float-right">{ratings[index]}</span>
    </div>
  );
}
