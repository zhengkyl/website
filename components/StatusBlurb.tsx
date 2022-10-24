import useSWR from "swr";

import fetcher from "../utils/fetcher";

{
  /* <Image
          src={imgSrc}
          alt={imgAlt}
          layout="fixed"
          height={imgHeight}
          width={imgWidth}
        /> */
}

const getJoinSymbol = (index, length) => {
  if (length < 2 || index >= length - 1) return "";

  if (length === 2 && index === 0) return " and ";

  return ", ";
};

// Punctation like '.' or ',' needs to be inside inline-block span or it will wrap separately
const InlineSong = ({ song, punctuation }) => (
  <span className="text-red-600">
    <span className="inline-block">
      "
      <a className="hover:underline font-bold" href={song.link}>
        {song.title}
      </a>
      "
    </span>{" "}
    by{" "}
    {song.artists.map((artist, i) => (
      <span className="inline-block" key={artist.link}>
        <a
          className="hover:underline font-bold in"
          href={artist.link}
          target="_blank"
        >
          {artist.name}
        </a>
        {getJoinSymbol(i, song.artists.length)}
        {i === song.artists.length - 1 && punctuation}
      </span>
    ))}
  </span>
);

const InlineMovie = ({ movie, punctuation }) => (
  <span className="text-red-600 inline-block">
    <a className="hover:underline italic font-bold" href={movie.link}>
      {movie.title}
    </a>
    {punctuation ?? ""}
  </span>
);

export const StatusBlurb = (props) => {
  // const { data: movieData } = useSWR("/api/lastWatched", fetcher);
  const movieData = null;
  const { data: songData } = useSWR("/api/lastPlayed", fetcher);
  const { data: likeData } = useSWR("/api/lastLiked", fetcher);

  const movie = movieData ?? {
    imageUrl: "/images/zheng512.png",
    link: "kylezhe.ng",
    year: "2021",
    title: "nothing",
  };
  const song = songData ?? {
    imageUrl: "/images/zheng512.png",
    link: "kylezhe.ng",
    title: "nothing",
    artists: [{ name: "no one", link: "" }],
    playing: false,
  };
  const like = likeData ?? {
    imageUrl: "/images/zheng512.png",
    link: "kylezhe.ng",
    title: "nothing",
    artists: [{ name: "no one", link: "" }],
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-16 sm:gap-8 ">
        <div
          className="h-auto self-start sticky top-0 pt-32 -mt-32 mb-[-4.25rem] w-full sm:w-auto"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 95%, rgba(255,255,255,0) 100%)",
          }}
        >
          <span className="text-3xl whitespace-nowrap font-bold">
            Kyle Zheng
          </span>
        </div>
        <div className="flex flex-col gap-12 text-3xl font-medium" {...props}>
          <p>
            {`${song.playing ? "is" : "was"}`} listening to{" "}
            <InlineSong song={song} punctuation="," /> and he really likes{" "}
            <InlineSong song={like} punctuation="." />
          </p>
          <p>
            recently watched <InlineMovie movie={movie} punctuation="." /> It
            was <span>okay</span>.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-16 mt-16 sm:gap-8 sm:mt-8">
        {/* Hidden and matches navbar name size. Still visible to screen readers. */}
        <h1 className="text-3xl whitespace-nowrap hidden sm:block sm:invisible">
          Kyle Zheng
        </h1>
        <div className="text-3xl font-medium" {...props}>
          <p>
            develops web apps, because the web is{" "}
            <span className="font-bold">cross-platform,</span>{" "}
            <span className="font-bold">accessible,</span> and{" "}
            <span className="font-bold">more performant than ever.</span>
          </p>
        </div>
      </div>
    </>
  );
};
